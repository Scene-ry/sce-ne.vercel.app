'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

export default function BiliLiveLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('loading');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/bili-proxy/generate');
      const data = await response.json();

      if (data.code === 0) {
        setStatus('loaded');
        QRCode.toCanvas(canvasRef.current!, data.data.url, {
          width: 200,
        });
        startPolling(data.data.qrcode_key);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

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
          router.push('/bililive');
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Bilibili Login</h1>
        {status === 'loading' && (
          <div className="text-center">Loading QR Code...</div>
        )}
        {status === 'error' && (
          <div className="text-red-500 text-center">
            Error loading QR code. Please try again.
            <button
              onClick={fetchQRCode}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}
        {status === 'scanned' && (
          <div className="text-yellow-600 text-center mb-4">
            QR code scanned. Please confirm login in your Bilibili app.
          </div>
        )}
        <div className="text-center">
          <div className="qr-code-container mb-4">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-gray-600">
            Scan the QR code with your Bilibili mobile app to login
          </p>
        </div>
      </div>
    </div>
  );
}
