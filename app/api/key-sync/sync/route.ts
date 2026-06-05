import { Redis } from '@upstash/redis';

const isVercelEnv = process.env.APP_ENV === 'vercel';
const kv = Redis.fromEnv({ enableAutoPipelining: isVercelEnv });
import { NextRequest, NextResponse } from 'next/server';

const SYNC_TTL_SECONDS = 300; // 5 minutes
const MAX_PAYLOAD_BYTES = 65_536; // 64 KiB – enough for any realistic secret
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 5; // max sync requests per IP per window

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function isValidRetrievalToken(v: unknown): v is string {
  // Must be a lowercase hex SHA-256 hash (64 chars)
  return typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
}

function isValidPayload(v: unknown): v is string {
  return (
    typeof v === 'string' &&
    v.length > 0 &&
    Buffer.byteLength(v, 'utf8') <= MAX_PAYLOAD_BYTES
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // --- Rate limit ---
  const ip = getClientIP(req);
  const rlKey = `rl:sync:${ip}`;
  const count = await kv.incr(rlKey);
  if (count === 1) await kv.expire(rlKey, RATE_LIMIT_WINDOW);
  if (count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 },
    );
  }

  // --- Parse body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { retrievalToken, encryptedPayload } = body as Record<string, unknown>;

  if (!isValidRetrievalToken(retrievalToken)) {
    return NextResponse.json({ error: 'Invalid retrieval token.' }, { status: 400 });
  }
  if (!isValidPayload(encryptedPayload)) {
    return NextResponse.json({ error: 'Invalid or oversized payload.' }, { status: 400 });
  }

  // --- Store (NX = only if not exists) ---
  const kvKey = `ks:${retrievalToken}`;
  const stored = await kv.set(kvKey, encryptedPayload, {
    ex: SYNC_TTL_SECONDS,
    nx: true,
  });

  if (stored === null) {
    return NextResponse.json(
      { error: 'This session code is already in use. Generate a new one.' },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true, expiresIn: SYNC_TTL_SECONDS });
}
