'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';
import partitionsData from '../../room-partitions.json';

export default function BiliLivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  // 获取所有分区
  const partitionList: { id: string; name: string }[] = [];
  let defaultPartitionId = '235';
  partitionsData.data.forEach((cat: any) => {
    cat.list.forEach((item: any) => {
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
      });
      if (!res.ok) throw new Error('请求失败');
      // 可根据返回内容做后续处理
    } catch (e: any) {
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
      });
      if (!res.ok) throw new Error('请求失败');
      // 可根据返回内容做后续处理
    } catch (e: any) {
      setError(e.message || '未知错误');
    } finally {
      setStopLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BiliLive Dashboard</h1>
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
      {/* Add your BiliLive content here */}
    </div>
  );
}