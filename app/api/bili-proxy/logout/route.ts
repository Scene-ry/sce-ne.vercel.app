import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? '';
  const cookiesArr = cookie.split(';').map(row => row.trim());
  const bili_jct = cookiesArr.find(row => row.startsWith('bili_jct='))?.split('=')[1] || '';
  const params = new URLSearchParams({
    biliCSRF: bili_jct,
    gourl: '/bililive/login',
  });
  const res = await fetch('https://passport.bilibili.com/login/exit/v2', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': cookie,
      'origin': 'https://www.bilibili.com',
      'referer': 'https://www.bilibili.com/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',
    },
    body: params.toString(),
    credentials: 'include',
  });
  const data = await res.json();
  return NextResponse.json(data);
}
