import { NextResponse } from 'next/server'
import { verifySession, getSessionCookie } from '@/lib/auth'
import { getInquiries } from '@/lib/kv'

export async function GET(req: Request) {
  const cookie = getSessionCookie(req)
  if (!cookie || !verifySession(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const inquiries = await getInquiries()
  return NextResponse.json(inquiries)
}
