import { createHmac, timingSafeEqual } from 'crypto'

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function signSession(password: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET!
  return createHmac('sha256', secret).update(password).digest('hex')
}

export function verifySession(cookie: string): boolean {
  if (!cookie) return false
  try {
    const expected = signSession(process.env.ADMIN_PASSWORD!)
    const a = Buffer.from(cookie, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
