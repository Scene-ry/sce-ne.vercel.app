import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 从前端请求头获取cookie
  const cookie = req.headers.get('cookie') ?? '';

  // 获取DedeUserID等cookie
  const cookiesArr = cookie.split(';').map(row => row.trim());
  const bili_jct = cookiesArr.find(row => row.startsWith('bili_jct=')) ?? '';

  // 获取前端传来的参数
  const { roomId } = await req.json();

  const params = new URLSearchParams({
    room_id: roomId || '',
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
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
    body: params.toString(),
    credentials: 'include',
  });
  const data = await res.json();
  return NextResponse.json(data);
}
