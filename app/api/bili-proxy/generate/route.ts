import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://passport.bilibili.com/x/passport-login/web/qrcode/generate', {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://passport.bilibili.com/',
      'Origin': 'https://passport.bilibili.com',
    },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
