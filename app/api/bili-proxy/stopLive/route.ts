import { NextRequest, NextResponse } from 'next/server';

// 简单内存限流（生产建议用redis等持久化方案）
const ipMap = new Map<string, number>();
const INTERVAL = 10 * 1000;

export async function POST(req: NextRequest) {
  // CSRF防护：只允许本站origin
  const origin = req.headers.get('origin') || '';
  if (origin && !origin.includes('localhost') && !origin.includes('sce-ne.vercel.app') && !origin.includes('sce-ne.work')) {
    return NextResponse.json({ code: -1, message: 'CSRF forbidden' }, { status: 403 });
  }

  // 简单限流
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const last = ipMap.get(ip) || 0;
  if (now - last < INTERVAL) {
    ipMap.set(ip, now);
    return NextResponse.json({ code: -1, message: 'Too many requests' }, { status: 429 });
  }
  ipMap.set(ip, now);

  // 从前端请求头获取cookie
  const cookie = req.headers.get('cookie') ?? '';
  // 获取DedeUserID等cookie
  const cookiesArr = cookie.split(';').map(row => row.trim());
  const bili_jct = cookiesArr.find(row => row.startsWith('bili_jct=')) ?? '';

  // 获取前端传来的参数
  let body: { roomId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ code: -1, message: 'Invalid JSON' }, { status: 400 });
  }
  const { roomId } = body;
  if (!roomId || typeof roomId !== 'string') {
    return NextResponse.json({ code: -1, message: '参数错误' }, { status: 400 });
  }

  const params = new URLSearchParams({
    room_id: roomId,
    platform: 'pc_link',
    csrf_token: bili_jct.split('=')[1],
    csrf: bili_jct.split('=')[1],
  });
  const res = await fetch('https://api.live.bilibili.com/room/v1/Room/stopLive', {
    method: 'POST',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://link.bilibili.com',
      'referer': 'https://link.bilibili.com/p/center/index',
      'sec-ch-ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',
      'cookie': cookie,
    },
    body: params.toString(),
    credentials: 'include',
  });
  const { code, message, data } = await res.json();
  return NextResponse.json({ code, message, data });
}
