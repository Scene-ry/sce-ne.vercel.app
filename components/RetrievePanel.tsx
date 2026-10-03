'use client';

import { useState, useEffect } from 'react';
import {
  normalizeCode,
  formatCode,
  decryptSecret,
  deriveRetrievalToken,
  SESSION_CODE_LENGTH,
} from '@/lib/crypto';

type Status = 'idle' | 'processing' | 'decrypted' | 'error';

interface Props {
  prefillCode?: string;
}

export default function RetrievePanel({ prefillCode = '' }: Props) {
  const [codeInput, setCodeInput] = useState(prefillCode);
  const [status, setStatus] = useState<Status>('idle');
  const [decryptedKey, setDecryptedKey] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const code = normalizeCode(prefillCode);
    if (code.length === SESSION_CODE_LENGTH) {
      handleRetrieve(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCodeInput(normalizeCode(e.target.value));
    setError('');
  }

  async function handleRetrieve(explicitCode?: string) {
    const sessionCode = explicitCode ?? normalizeCode(codeInput);
    if (sessionCode.length !== SESSION_CODE_LENGTH) return;

    setStatus('processing');
    setError('');

    try {
      const retrievalToken = await deriveRetrievalToken(sessionCode);

      const res = await fetch('/api/key-sync/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retrievalToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Retrieval failed.');
      }

      const { encryptedPayload } = (await res.json()) as { encryptedPayload: string };

      const plaintext = await decryptSecret(encryptedPayload, sessionCode);
      setDecryptedKey(plaintext);
      setStatus('decrypted');
    } catch (err) {
      setStatus('error');
      if (err instanceof DOMException && err.name === 'OperationError') {
        setError('Decryption failed — the session code may be incorrect.');
      } else {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(decryptedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleReset() {
    setStatus('idle');
    setCodeInput('');
    setDecryptedKey('');
    setRevealed(false);
    setCopied(false);
    setError('');
  }

  // ── Decrypted state ──
  if (status === 'decrypted') {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="text-emerald-500 text-base font-semibold">Key retrieved!</div>
          <div className="text-muted text-sm mt-0.5">
            Decrypted entirely in your browser
          </div>
        </div>

        <div className="bg-surface-hover rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Your Secret Key
            </span>
            <button
              onClick={() => setRevealed((r) => !r)}
              className="text-xs text-primary hover:text-primary-dark transition-colors"
            >
              {revealed ? 'Hide' : 'Reveal'}
            </button>
          </div>

          <div
            className={`font-mono text-sm break-all bg-surface rounded-lg p-3 select-all transition-all duration-150 ${
              revealed ? 'text-foreground' : 'blur-sm select-none pointer-events-none text-foreground'
            }`}
          >
            {decryptedKey}
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
          >
            {copied ? '✓ Copied to Clipboard' : 'Copy to Clipboard'}
          </button>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-500 leading-relaxed">
          This key has been permanently deleted from the server. It exists only
          in this window — close or refresh the tab to destroy it.
        </div>

        <button
          onClick={handleReset}
          className="w-full py-2 rounded-lg border border-border hover:bg-surface-hover text-sm text-muted transition-colors"
        >
          Retrieve Another Key
        </button>
      </div>
    );
  }

  // ── Idle / processing / error state ──
  const isComplete = normalizeCode(codeInput).length === SESSION_CODE_LENGTH;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted mb-1.5">
          Session Code
        </label>
        <input
          type="text"
          value={formatCode(codeInput)}
          onChange={handleCodeChange}
          placeholder="XXXX-XXXX"
          maxLength={9}
          disabled={status === 'processing'}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-2xl font-mono font-bold text-center tracking-widest text-foreground placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary uppercase disabled:opacity-50 transition-colors"
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={() => handleRetrieve()}
        disabled={!isComplete || status === 'processing'}
        className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-surface-hover disabled:text-muted text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
      >
        {status === 'processing' ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Fetching &amp; decrypting…
          </>
        ) : (
          'Retrieve Key'
        )}
      </button>

      <div className="bg-surface-hover border border-border rounded-xl p-3 text-xs text-muted space-y-1">
        <div className="font-medium text-foreground mb-1.5">How it works</div>
        <ul className="space-y-1 list-disc pl-4">
          <li>Enter the 8-character code shown on the sending device</li>
          <li>Your browser hashes the code before sending it to the server</li>
          <li>The encrypted blob is decrypted locally — your key never travels in plain text</li>
          <li>Each code can only be used once</li>
        </ul>
      </div>
    </div>
  );
}
