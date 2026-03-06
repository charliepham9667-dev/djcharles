import { kv } from '@vercel/kv'
import { randomUUID } from 'crypto'
import type { Inquiry, BookingFormData, InquiryStatus } from '@/types'

export async function saveInquiry(data: BookingFormData): Promise<Inquiry> {
  const inquiry: Inquiry = {
    ...data,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    status: 'New',
  }
  await kv.hset(`inquiry:${inquiry.id}`, inquiry as unknown as Record<string, unknown>)
  await kv.zadd('inquiries:all', { score: Date.now(), member: inquiry.id })
  return inquiry
}

export async function getInquiries(): Promise<Inquiry[]> {
  const ids = await kv.zrange('inquiries:all', 0, -1, { rev: true })
  if (!ids || ids.length === 0) return []
  const results = await Promise.all(ids.map((id) => kv.hgetall(`inquiry:${id}`)))
  return results.filter(Boolean) as Inquiry[]
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  await kv.hset(`inquiry:${id}`, { status } as unknown as Record<string, unknown>)
}
