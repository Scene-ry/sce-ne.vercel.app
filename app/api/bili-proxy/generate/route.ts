import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://passport.bilibili.com/x/passport-login/web/qrcode/generate', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',
      'Referer': 'https://www.bilibili.com/',
      'Origin': 'https://www.bilibili.com',
    },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
