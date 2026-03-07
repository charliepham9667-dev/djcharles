import { NextResponse } from 'next/server'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(req: Request) {
  const { password } = await req.json() as { password: string }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  const token = signSession(password)
  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
