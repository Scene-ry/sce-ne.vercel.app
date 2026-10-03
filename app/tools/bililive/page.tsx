'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import partitionsData from './room-partitions.json';

export default function BiliLivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rtmpInfo, setRtmpInfo] = useState<{ addr: string; code: string } | null>(null);
  const [copied, setCopied] = useState<{ addr: boolean; code: boolean }>({ addr: false, code: false });
  const [faceQr, setFaceQr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    document.title = 'biliLive Console - Scene\'s House';
  }, []);

  useEffect(() => {
    if (faceQr && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, faceQr, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).catch(err => console.error('QR render error:', err));
    }
  }, [faceQr]);

  // 获取所有分区
  const partitionList: { id: string; name: string; }[] = [];
  const defaultPartitionId = '235';
  partitionsData.data.forEach((cat) => {
    cat.list.forEach((item) => {
      const fullName = `${cat.name} - ${item.name}`;
      partitionList.push({ id: item.id, name: fullName });
    });
  });
  const [selectedPartition, setSelectedPartition] = useState<string>(defaultPartitionId);

  useEffect(() => {
    const checkAuth = () => {
      const biliCookie = document.cookie.split(';').find(row => row.trim().startsWith('DedeUserID='));
      
      if (!biliCookie) {
        router.push('/tools/bililive/login');
        return;
      }
      // 获取房间号
      const dedeUserID = biliCookie.split('=')[1];
      fetch(`/api/bili-proxy/roomIdByUid?uid=${encodeURIComponent(dedeUserID)}`)
        .then(res => res.json())
        .then(data => {
          if (data.code === 0 && data.data && data.data.room_id) {
            setRoomId(data.data.room_id.toString());
          } else {
            setRoomId('获取失败');
          }
        })
        .catch(() => setRoomId('获取失败'));
    };

    checkAuth();
  }, [router]);

  const handleStartLive = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bili-proxy/startLive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partitionId: selectedPartition, roomId }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('请求失败');
      const result = await res.json();
      if (result?.data?.need_face_auth) {
        const qrUrl = result.data.qr;
        // 使用qrUrl生成二维码供用户扫码认证
        setFaceQr(qrUrl);
        setRtmpInfo(null);
      } else if (result?.data?.rtmp?.addr && result?.data?.rtmp?.code) {
        setRtmpInfo({ addr: result.data.rtmp.addr, code: result.data.rtmp.code });
      } else {
        setRtmpInfo(null);
      }
    } catch (e: any) {  // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(e.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const handleStopLive = async () => {
    setStopLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bili-proxy/stopLive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('请求失败');
      setRtmpInfo(null);
      // 可根据返回内容做后续处理
    } catch (e: any) {  // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(e.message || '未知错误');
    } finally {
      setStopLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/bili-proxy/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
      });
      // 清空常见B站cookie
      [
        'SESSDATA',
        'bili_jct',
        'DedeUserID',
        'DedeUserID__ckMd5',
        'sid'
      ].forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
      router.push('/tools/bililive/login');
    } catch {
      // 可加错误提示
    }
  };

  const copyToClipboard = (text: string, type: 'addr' | 'code') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">BiliLive 控制台</h1>
            <button
              className="px-4 py-2 bg-surface-hover hover:bg-border text-foreground border border-border rounded-lg transition-colors duration-200 flex items-center"
              onClick={handleLogout}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </div>
          
          <div className="mb-8 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-primary">房间号：</span>
              <span className="ml-2 text-primary">
                {roomId === null ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    加载中...
                  </span>
                ) : roomId}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-base font-semibold text-foreground mb-3">
              选择直播分区
            </label>
            <div className="relative">
              <select
                className="w-full p-2.5 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors appearance-none pr-10"
                value={selectedPartition}
                onChange={e => setSelectedPartition(e.target.value)}
              >
                <option value="">请选择分区</option>
                {partitionList.map(part => (
                  <option key={part.id} value={part.id}>{part.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                loading || !selectedPartition 
                  ? 'bg-primary cursor-not-allowed opacity-75 text-white' 
                  : 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
              onClick={handleStartLive}
              disabled={loading || !selectedPartition}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  启动中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  开始直播
                </>
              )}
            </button>
            
            <button
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                stopLoading 
                  ? 'bg-red-500 cursor-not-allowed opacity-75 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
              onClick={handleStopLive}
              disabled={stopLoading}
            >
              {stopLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  停止中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  停止直播
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-8 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-500 font-medium">错误：</span>
                <span className="ml-2 text-red-400">{error}</span>
              </div>
            </div>
          )}

          {faceQr && (
            <div className="mb-8 bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-amber-500 mb-4">需要人脸认证</h2>
              <div className="flex flex-col items-center">
                <div className="border border-border rounded-xl p-4 bg-surface inline-block mb-4">
                  <canvas ref={canvasRef} />
                </div>
                <p className="text-sm text-amber-400 text-center mb-3">请使用哔哩哔哩 App 扫描上方二维码进行人脸认证。</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFaceQr(null)}
                    className="px-4 py-2 bg-surface-hover hover:bg-border text-foreground border border-border rounded-lg transition-colors duration-200"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          {rtmpInfo && (
            <div className="mb-8 bg-surface-hover/50 border border-border rounded-xl p-5">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                推流信息
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">推流地址</label>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={rtmpInfo.addr}
                      className="flex-1 min-w-0 px-3 py-2 bg-surface border border-border rounded-l-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 truncate"
                    />
                    <button
                      onClick={() => copyToClipboard(rtmpInfo.addr, 'addr')}
                      className="px-3 py-2 bg-surface-hover hover:bg-border border border-l-0 border-border rounded-r-lg text-muted flex items-center transition-colors duration-200"
                    >
                      {copied.addr ? (
                        <>
                          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          已复制
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          复制
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">推流码</label>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={rtmpInfo.code}
                      className="flex-1 min-w-0 px-3 py-2 bg-surface border border-border rounded-l-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 truncate"
                    />
                    <button
                      onClick={() => copyToClipboard(rtmpInfo.code, 'code')}
                      className="px-3 py-2 bg-surface-hover hover:bg-border border border-l-0 border-border rounded-r-lg text-muted flex items-center transition-colors duration-200"
                    >
                      {copied.code ? (
                        <>
                          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          已复制
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          复制
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-amber-400 text-sm">
                    请将以上推流信息配置到您的直播软件（如OBS）中，然后开始直播。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
