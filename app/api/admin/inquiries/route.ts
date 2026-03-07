import { NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { getInquiries } from '@/lib/kv'

function getSessionCookie(req: Request): string | undefined {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  return match?.[1]
}

export async function GET(req: Request) {
  const cookie = getSessionCookie(req)
  if (!cookie || !verifySession(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const inquiries = await getInquiries()
  return NextResponse.json(inquiries)
}
