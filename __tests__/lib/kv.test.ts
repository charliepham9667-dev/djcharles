// Mock @vercel/kv before importing the module under test
const mockStore: Record<string, Record<string, unknown>> = {}
const mockSorted: { score: number; member: string }[] = []

jest.mock('@vercel/kv', () => ({
  kv: {
    hset: jest.fn(async (key: string, data: Record<string, unknown>) => {
      mockStore[key] = data
    }),
    hgetall: jest.fn(async (key: string) => mockStore[key] ?? null),
    zadd: jest.fn(async (_key: string, item: { score: number; member: string }) => {
      mockSorted.push(item)
    }),
    zrange: jest.fn(async () => mockSorted.map((i) => i.member)),
  },
}))

import { saveInquiry, getInquiries, updateInquiryStatus } from '@/lib/kv'
import type { BookingFormData } from '@/types'

const sampleData: BookingFormData = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  eventType: 'Club Night',
  eventDate: '2026-06-15',
  location: 'Oslo, Norway',
  guestCount: '100–250',
  package: 'Full Night',
  message: 'Looking forward to it!',
}

describe('kv helpers', () => {
  it('saveInquiry returns an inquiry with id and status New', async () => {
    const inquiry = await saveInquiry(sampleData)
    expect(inquiry.id).toBeDefined()
    expect(typeof inquiry.id).toBe('string')
    expect(inquiry.status).toBe('New')
    expect(inquiry.name).toBe('Jane Smith')
    expect(inquiry.submittedAt).toBeDefined()
  })

  it('getInquiries returns an array', async () => {
    const result = await getInquiries()
    expect(Array.isArray(result)).toBe(true)
  })

  it('updateInquiryStatus calls hset with updated status', async () => {
    await updateInquiryStatus('test-id', 'Confirmed')
    const { kv } = await import('@vercel/kv')
    expect(kv.hset).toHaveBeenCalledWith('inquiry:test-id', { status: 'Confirmed' })
  })
})
