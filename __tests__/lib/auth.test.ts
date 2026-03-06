process.env.ADMIN_PASSWORD = 'testpassword'
process.env.ADMIN_SESSION_SECRET = 'testsecret'

import { signSession, verifySession } from '@/lib/auth'

describe('auth helpers', () => {
  it('signSession returns a hex string', () => {
    const token = signSession('testpassword')
    expect(typeof token).toBe('string')
    expect(token).toMatch(/^[0-9a-f]+$/)
  })

  it('verifySession returns true for valid cookie', () => {
    const token = signSession('testpassword')
    expect(verifySession(token)).toBe(true)
  })

  it('verifySession returns false for invalid cookie', () => {
    expect(verifySession('bad-token')).toBe(false)
  })

  it('verifySession returns false for empty string', () => {
    expect(verifySession('')).toBe(false)
  })
})
