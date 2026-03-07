import { NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { updateInquiryStatus } from '@/lib/kv'
import type { InquiryStatus } from '@/types'

const VALID_STATUSES: InquiryStatus[] = ['New', 'In Progress', 'Confirmed', 'Declined']

function getSessionCookie(req: Request): string | undefined {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  return match?.[1]
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = getSessionCookie(req)
  if (!cookie || !verifySession(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { status } = await req.json() as { status: InquiryStatus }
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  const { id } = await params
  await updateInquiryStatus(id, status)
  return NextResponse.json({ success: true })
}
