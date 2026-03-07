process.env.ADMIN_PASSWORD = 'testpass'
process.env.ADMIN_SESSION_SECRET = 'testsecret'

jest.mock('@/lib/kv', () => ({
  getInquiries: jest.fn(async () => [{ id: '1', name: 'Test', status: 'New' }]),
  updateInquiryStatus: jest.fn(async () => {}),
}))

import { GET } from '@/app/api/admin/inquiries/route'
import { PATCH } from '@/app/api/admin/inquiries/[id]/route'
import { signSession } from '@/lib/auth'

function makeRequest(method: string, body?: unknown, withCookie = true) {
  const token = signSession('testpass')
  return new Request('http://localhost/api/admin/inquiries', {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(withCookie ? { cookie: `admin_session=${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
}

describe('GET /api/admin/inquiries', () => {
  it('returns 401 without cookie', async () => {
    const res = await GET(makeRequest('GET', undefined, false))
    expect(res.status).toBe(401)
  })

  it('returns 200 with valid cookie', async () => {
    const res = await GET(makeRequest('GET'))
    expect(res.status).toBe(200)
  })
})
