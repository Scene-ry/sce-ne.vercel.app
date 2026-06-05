'use client';

import { useState, useEffect, useRef } from 'react';
// import { QRCodeSVG } from 'qrcode.react';
import {
  generateSessionCode,
  encryptSecret,
  deriveRetrievalToken,
  formatCode,
} from '@/lib/crypto';

type Status = 'idle' | 'processing' | 'synced' | 'error';

const EXPIRY_SECONDS = 300;

export default function SyncPanel() {
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [sessionCode, setSessionCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  // const [qrUrl, setQrUrl] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTimer() {
    setSecondsLeft(EXPIRY_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setStatus('idle');
          setSessionCode('');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function handleSync() {
    if (!secret.trim()) return;
    setStatus('processing');
    setError('');

    try {
      const code = generateSessionCode();
      const [encryptedPayload, retrievalToken] = await Promise.all([
        encryptSecret(secret.trim(), code),
        deriveRetrievalToken(code),
      ]);

      const res = await fetch('/api/key-sync/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retrievalToken, encryptedPayload }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Sync failed. Try again.');
      }

      setSessionCode(code);
      // setQrUrl(`${window.location.origin}/?code=${code}`);
      setStatus('synced');
      startTimer();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  }

  async function handleCopyCode() {
    await navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setSessionCode('');
    setSecret('');
    setError('');
    setCopied(false);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const expiryDisplay = `${minutes}:${secs.toString().padStart(2, '0')}`;
  const expiryColor = secondsLeft < 60 ? 'text-red-400' : 'text-yellow-400';

  // ── Synced state ──────────────────────────────────────────────────────────
  if (status === 'synced') {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="text-green-400 text-lg font-semibold">Key synced!</div>
          <div className="text-slate-400 text-sm mt-0.5">
            Share the code below with the receiving device
          </div>
        </div>

        {/* Session code card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 text-center space-y-3">
          <div className="font-mono text-3xl font-bold tracking-widest text-gray-900 dark:text-white select-all">
            {formatCode(sessionCode)}
          </div>
          <div className="text-gray-600 dark:text-slate-400 text-sm">
            Expires in{' '}
            <span className={`font-mono font-bold ${expiryColor}`}>
              {expiryDisplay}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>

        {/* QR code */}
        {/* <div className="flex flex-col items-center gap-2">
          <p className="text-slate-400 text-xs">
            Or scan this QR code on the other device to auto-fill the code
          </p>
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <QRCodeSVG value={qrUrl} size={160} level="M" />
          </div>
        </div> */}

        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          The receiving device will use this code to retrieve and decrypt your
          key locally. The code is one-time use and the server stores only an
          encrypted blob — it cannot read your key.
        </div>

        <button
          onClick={handleReset}
          className="w-full py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm text-slate-400 transition-colors"
        >
          Sync Another Key
        </button>
      </div>
    );
  }

  // ── Idle / processing / error state ──────────────────────────────────────
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Secret Key
        </label>
        <textarea
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Paste your API key, private key, password, or any secret…"
          rows={5}
          disabled={status === 'processing'}
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
        />
        <div className="mt-1 text-xs text-slate-500 text-right">
          {secret.length} characters
        </div>
      </div>

      {status === 'error' && (
        <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleSync}
        disabled={!secret.trim() || status === 'processing'}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        {status === 'processing' ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Encrypting &amp; uploading…
          </>
        ) : (
          'Generate Sync Code'
        )}
      </button>

      {/* How it works */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs text-gray-500 dark:text-slate-400 space-y-1">
        <div className="font-medium text-slate-400 mb-1.5">How it works</div>
        <ul className="space-y-1 list-disc pl-4">
          <li>Your key is encrypted in-browser with AES-256-GCM before upload</li>
          <li>Only a SHA-256 hash of the sync code is sent to the server</li>
          <li>The server cannot decrypt the blob — it&apos;s zero-knowledge</li>
          <li>The sync code is one-time use and expires in 5 minutes</li>
        </ul>
      </div>
    </div>
  );
}
