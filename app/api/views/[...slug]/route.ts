import { NextRequest, NextResponse } from 'next/server'

function isKVConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  if (!isKVConfigured()) {
    return NextResponse.json({ views: null })
  }

  const { kv } = await import('@vercel/kv')
  const { slug } = await params
  const slugPath = slug.join('/')
  const views = (await kv.get<number>(`views:${slugPath}`)) ?? 0

  return NextResponse.json({ views })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  if (!isKVConfigured()) {
    return NextResponse.json({ views: null })
  }

  const { kv } = await import('@vercel/kv')
  const { slug } = await params
  const slugPath = slug.join('/')
  const views = await kv.incr(`views:${slugPath}`)

  return NextResponse.json({ views })
}
