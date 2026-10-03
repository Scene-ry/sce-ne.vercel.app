'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

export default function BiliLiveLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('loading');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startPolling = (key: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/bili-proxy/poll?qrcode_key=${encodeURIComponent(key)}`);
        const data = await response.json();

        if (data.data.code === 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Login successful
          router.push('/tools/bililive');
        } else if (data.data.code === 86038) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // QR code expired
          fetchQRCode();
        } else if (data.data.code === 86090) {
          setStatus('scanned');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(checkStatus, 3000);
  };

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/bili-proxy/generate');
      const data = await response.json();

      if (data.code === 0) {
        setStatus('loaded');
        QRCode.toCanvas(canvasRef.current!, data.data.url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        startPolling(data.data.qrcode_key);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    document.title = 'bilibili Login - Scene\'s House';
    fetchQRCode();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-6">bilibili Login</h1>
          
          <div className="flex flex-col items-center justify-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted">Generating QR Code...</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 mb-6 w-full max-w-md">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-500">Failed</h3>
                </div>
                <p className="text-red-500 mb-4">Unable to generate QR code. Please retry later.</p>
                <button
                  onClick={fetchQRCode}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Reload
                </button>
              </div>
            )}
            
            {status === 'scanned' && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6 w-full max-w-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-amber-500 font-medium">QR Code Scanned</p>
                </div>
                <p className="text-amber-500 mt-2">Please confirm login in App</p>
              </div>
            )}
            
            {/* 添加居中对齐的父容器 */}
            <div className={`transition-all duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              <div className="flex flex-col items-center justify-center">
                <div className="border border-border rounded-xl p-4 bg-surface-hover inline-block mb-6">
                  <canvas className="qr-code-container" ref={canvasRef} />
                </div>
                <p className="text-muted text-center flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1zm0 10h2a1 1 0 001-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1zM5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1zm0 10h2a1 1 0 001-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1zM9 4h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V5a1 1 0 011-1z" />
                  </svg>
                  Please scan QR code with bilibili App to login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
