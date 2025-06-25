import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qrcode_key = searchParams.get('qrcode_key');
  if (!qrcode_key) {
    return NextResponse.json({ code: -1, message: 'Missing qrcode_key' }, { status: 400 });
  }
  const res = await fetch(`https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${encodeURIComponent(qrcode_key)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://passport.bilibili.com/',
      'Origin': 'https://passport.bilibili.com',
    },
    credentials: 'include',
  });
  const data = await res.json();
  const response = NextResponse.json(data);
  const cookies = Object.fromEntries(
    res.headers.getSetCookie()
      .flatMap((cookie) => cookie.split(';'))
      .map((cookie) => cookie.trim().split('='))
  );
  for (const key in cookies) {
    response.cookies.set(key, cookies[key]);
  }
  return response;
}
