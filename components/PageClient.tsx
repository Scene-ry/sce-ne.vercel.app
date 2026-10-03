'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import SyncPanel from './SyncPanel';
import RetrievePanel from './RetrievePanel';
import { normalizeCode } from '@/lib/crypto';

type Tab = 'send' | 'receive';

export default function PageClient() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') ?? '';

  const [activeTab, setActiveTab] = useState<Tab>(codeFromUrl ? 'receive' : 'send');
  const [prefillCode] = useState(() => normalizeCode(codeFromUrl));

  useEffect(() => {
    if (codeFromUrl) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">KeySync</h1>
        <p className="text-sm text-muted mt-1">Secure end-to-end encrypted key transfer</p>
      </div>

      {/* Tab bar */}
      <div className="flex bg-surface-hover rounded-xl p-1 mb-4 border border-border">
        <TabButton
          label="Send Key"
          active={activeTab === 'send'}
          onClick={() => setActiveTab('send')}
        />
        <TabButton
          label="Receive Key"
          active={activeTab === 'receive'}
          onClick={() => setActiveTab('receive')}
        />
      </div>

      {/* Panel card */}
      <div className="rounded-xl border border-border bg-surface p-5">
        {activeTab === 'send' ? (
          <SyncPanel />
        ) : (
          <RetrievePanel prefillCode={prefillCode} />
        )}
      </div>

      {/* Footer */}
      <p className="mt-4 text-center text-[11px] text-muted/60">
        End-to-end encrypted · AES-256-GCM · PBKDF2-SHA256 · Zero-knowledge server · One-time use
      </p>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'text-muted hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}
