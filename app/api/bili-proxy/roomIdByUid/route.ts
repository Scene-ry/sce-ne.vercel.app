import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');
  if (!uid) {
    return NextResponse.json({ code: -1, message: 'Missing uid' }, { status: 400 });
  }
  const res = await fetch(`https://api.live.bilibili.com/room/v2/Room/room_id_by_uid?uid=${encodeURIComponent(uid)}`);
  const data = await res.json();
  return NextResponse.json(data);
}
