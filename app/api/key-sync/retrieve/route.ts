import { Redis } from '@upstash/redis';

const isVercelEnv = process.env.APP_ENV === 'vercel';
const kv = Redis.fromEnv({ enableAutoPipelining: isVercelEnv });
import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 10; // max retrieve requests per IP per window

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function isValidRetrievalToken(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // --- Rate limit ---
  const ip = getClientIP(req);
  const rlKey = `rl:retrieve:${ip}`;
  const count = await kv.incr(rlKey);
  if (count === 1) await kv.expire(rlKey, RATE_LIMIT_WINDOW);
  if (count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 },
    );
  }

  // --- Parse body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { retrievalToken } = body as Record<string, unknown>;

  if (!isValidRetrievalToken(retrievalToken)) {
    return NextResponse.json({ error: 'Invalid retrieval token.' }, { status: 400 });
  }

  // --- One-time retrieve ---
  const kvKey = `ks:${retrievalToken}`;
  let encryptedPayload: string | null;
  if (!isVercelEnv) {
    // upstash-redis-local does not support pipeline; local fallback is non-atomic.
    encryptedPayload = await kv.get<string>(kvKey);
    if (encryptedPayload) await kv.del(kvKey);
  } else {
    [encryptedPayload] = await kv.pipeline()
      .get<string>(kvKey)
      .del(kvKey)
      .exec() as [string | null, number];
  }

  if (!encryptedPayload) {
    return NextResponse.json(
      { error: 'Session not found. The code may be wrong, expired, or already used.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ encryptedPayload });
}
