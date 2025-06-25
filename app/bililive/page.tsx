'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import partitionsData from '../../room-partitions.json';

export default function BiliLivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rtmpInfo, setRtmpInfo] = useState<{ addr: string; code: string } | null>(null);
  // 获取所有分区
  const partitionList: { id: string; name: string }[] = [];
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
        router.push('/bililive/login');
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
      if (result?.data?.rtmp?.addr && result?.data?.rtmp?.code) {
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
      router.push('/bililive/login');
    } catch {
      // 可加错误提示
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">BiliLive Dashboard</h1>
        <button
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
          onClick={handleLogout}
        >
          退出登录
        </button>
      </div>
      <div className="mb-4">房间号：{roomId === null ? '加载中...' : roomId}</div>
      <div className="mb-4">
        <label className="mr-2 font-semibold">分区：</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedPartition}
          onChange={e => setSelectedPartition(e.target.value)}
        >
          <option value="">请选择分区</option>
          {partitionList.map(part => (
            <option key={part.id} value={part.id}>{part.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleStartLive}
          disabled={loading || !selectedPartition}
        >
          {loading ? '启动中...' : '开始直播'}
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          onClick={handleStopLive}
          disabled={stopLoading}
        >
          {stopLoading ? '停止中...' : '停止直播'}
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {rtmpInfo && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <div><span className="font-semibold">推流地址：</span>{rtmpInfo.addr}</div>
          <div><span className="font-semibold">推流码：</span>{rtmpInfo.code}</div>
        </div>
      )}
      {/* Add your BiliLive content here */}
    </div>
  );
}