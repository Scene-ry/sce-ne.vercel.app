/**
 * Client-side E2EE cryptography utilities.
 *
 * Security model:
 *  - Session code is generated randomly and stays on-device (never sent raw to the server).
 *  - retrievalToken = SHA-256(code + ':retrieval:v1') is sent to the server as the storage key.
 *  - encryptionKey  = PBKDF2(code, randomSalt, 100k iterations, SHA-256) → AES-256-GCM.
 *  - Server stores only: SHA-256 hash + AES-GCM ciphertext — it cannot decrypt.
 */

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTE_LENGTH = 16; // bytes, prepended to ciphertext blob
const IV_BYTE_LENGTH = 12;   // bytes, AES-GCM recommended IV length

/** Unambiguous alphanumeric characters — excludes 0 / O / 1 / I / L */
const SESSION_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const SESSION_CODE_LENGTH = 8;

// ---------------------------------------------------------------------------
// Session code helpers
// ---------------------------------------------------------------------------

/** Generate a cryptographically random 8-character session code. */
export function generateSessionCode(): string {
  const buf = new Uint8Array(SESSION_CODE_LENGTH);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => SESSION_CODE_CHARS[b % SESSION_CODE_CHARS.length])
    .join('');
}

/** Display format: "ABCD-EFGH" */
export function formatCode(raw: string): string {
  const clean = normalizeCode(raw);
  if (clean.length <= 4) return clean;
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}

/** Strip all characters that are not valid code characters, uppercase. */
export function normalizeCode(input: string): string {
  return input
    .replace(/-/g, '')
    .toUpperCase()
    .replace(/[^A-Z2-9]/g, '')
    .slice(0, SESSION_CODE_LENGTH);
}

// ---------------------------------------------------------------------------
// Key derivation
// ---------------------------------------------------------------------------

async function digestHex(data: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(data),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derives a retrieval token (hex SHA-256 hash) from the session code.
 * This is the only code-derived value sent to the server — the raw session
 * code is never transmitted.
 */
export async function deriveRetrievalToken(sessionCode: string): Promise<string> {
  return digestHex(`${sessionCode}:retrieval:v1`);
}

async function deriveAesKey(
  sessionCode: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionCode),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  // Copy salt into a plain ArrayBuffer – required by the Web Crypto type contract
  const saltBuffer = new Uint8Array(salt).buffer as ArrayBuffer;
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBuffer, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ---------------------------------------------------------------------------
// Encoding helpers (avoids spread-into-large-call-stack issues)
// ---------------------------------------------------------------------------

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

// ---------------------------------------------------------------------------
// Encrypt / Decrypt
// ---------------------------------------------------------------------------

/**
 * Encrypt a plaintext secret using AES-256-GCM.
 * Output (base64): [ 16-byte salt | 12-byte IV | ciphertext ]
 */
export async function encryptSecret(
  secret: string,
  sessionCode: string,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTE_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTE_LENGTH));
  const key = await deriveAesKey(sessionCode, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(secret),
  );

  const combined = new Uint8Array(
    SALT_BYTE_LENGTH + IV_BYTE_LENGTH + ciphertext.byteLength,
  );
  combined.set(salt, 0);
  combined.set(iv, SALT_BYTE_LENGTH);
  combined.set(new Uint8Array(ciphertext), SALT_BYTE_LENGTH + IV_BYTE_LENGTH);

  return bytesToBase64(combined);
}

/**
 * Decrypt a base64 encrypted blob using the session code.
 * Throws `DOMException` (OperationError) if the session code is wrong.
 */
export async function decryptSecret(
  encryptedBlob: string,
  sessionCode: string,
): Promise<string> {
  const bytes = base64ToBytes(encryptedBlob);

  if (bytes.length < SALT_BYTE_LENGTH + IV_BYTE_LENGTH + 16) {
    throw new Error('Invalid encrypted payload: data too short');
  }

  const salt = bytes.slice(0, SALT_BYTE_LENGTH);
  const iv = bytes.slice(SALT_BYTE_LENGTH, SALT_BYTE_LENGTH + IV_BYTE_LENGTH);
  const ciphertext = bytes.slice(SALT_BYTE_LENGTH + IV_BYTE_LENGTH);

  const key = await deriveAesKey(sessionCode, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  );

  return new TextDecoder().decode(plaintext);
}
