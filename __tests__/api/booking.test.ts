jest.mock('@/lib/kv', () => ({ saveInquiry: jest.fn(async (d: Record<string, unknown>) => ({ ...d, id: 'test-id', submittedAt: new Date().toISOString(), status: 'New' })) }))
jest.mock('@/lib/email', () => ({ sendClientEmail: jest.fn(), sendAdminEmail: jest.fn() }))
jest.mock('@react-pdf/renderer', () => ({ renderToBuffer: jest.fn(async () => Buffer.from('pdf')) }))
jest.mock('@/lib/pdf', () => ({ RateCardPDF: () => null }))

import { POST } from '@/app/api/booking/route'

const validBody = {
  name: 'Jane', email: 'jane@test.com', eventType: 'Club Night',
  eventDate: '2026-06-15', location: 'Oslo', guestCount: '100–250',
  package: 'Full Night', message: 'Hi',
}

describe('POST /api/booking', () => {
  it('returns 400 for missing required fields', async () => {
    const req = new Request('http://localhost/api/booking', {
      method: 'POST', body: JSON.stringify({ name: '' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 for valid submission', async () => {
    const req = new Request('http://localhost/api/booking', {
      method: 'POST', body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
