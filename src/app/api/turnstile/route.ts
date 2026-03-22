import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  // Bypass in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({ success: true })
  }

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  )

  const data = await res.json()

  if (!data.success) {
    return NextResponse.json({ error: 'CAPTCHA failed' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}


