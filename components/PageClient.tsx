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
  // Capture the code once on mount; stored in state so it's stable across re-renders
  const [prefillCode] = useState(() => normalizeCode(codeFromUrl));

  // Remove the ?code= param from the URL so it doesn't persist on refresh
  useEffect(() => {
    if (codeFromUrl) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-4 px-4 text-center select-none">
        <div className="inline-flex items-center gap-2.5 mb-1">
          <span className="text-3xl" aria-hidden="true">🔐</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">KeySync</h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400 text-sm">Secure end-to-end encrypted key transfer</p>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-12">
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-10 max-w-4xl">
          {/* Tab bar */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-3 border border-gray-200 dark:border-gray-700">
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
            {activeTab === 'send' ? (
              <SyncPanel />
            ) : (
              <RetrievePanel prefillCode={prefillCode} />
            )}
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-slate-500">
            End-to-end encrypted · AES-256-GCM · PBKDF2-SHA256 · Zero-knowledge server · One-time use
          </p>
        </div>
      </main>
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
      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
