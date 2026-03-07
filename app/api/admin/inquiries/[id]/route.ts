import { NextResponse } from 'next/server'
import { verifySession, getSessionCookie } from '@/lib/auth'
import { updateInquiryStatus } from '@/lib/kv'
import type { InquiryStatus } from '@/types'

const VALID_STATUSES: InquiryStatus[] = ['New', 'In Progress', 'Confirmed', 'Declined']

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = getSessionCookie(req)
  if (!cookie || !verifySession(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let status: InquiryStatus
  try {
    const body = await req.json() as { status: InquiryStatus }
    status = body.status
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  const { id } = await params
  await updateInquiryStatus(id, status)
  return NextResponse.json({ success: true })
}
