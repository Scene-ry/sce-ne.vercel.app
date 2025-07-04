import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qrcode_key = searchParams.get('qrcode_key');
  if (!qrcode_key) {
    return NextResponse.json({ code: -1, message: 'Missing qrcode_key' }, { status: 400 });
  }
  const res = await fetch(`https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${encodeURIComponent(qrcode_key)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',
      'Referer': 'https://www.bilibili.com/',
      'Origin': 'https://www.bilibili.com',
    },
    credentials: 'include',
  });
  const data = await res.json();
  const response = NextResponse.json(data);
  res.headers.getSetCookie()
    .flatMap((cookie) => cookie.split(';'))
    .forEach((cookie) => {
      const [key, value] = cookie.trim().split('=');
      response.headers.append('Set-Cookie', `${key}=${value ?? ''}; Path=/`);
    });
  return response;
}
