import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'

async function verifyEdgeSession(cookie: string): Promise<boolean> {
  if (!cookie) return false
  try {
    const secret = process.env.ADMIN_SESSION_SECRET!
    const password = process.env.ADMIN_PASSWORD!
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(password))
    const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return cookie === expected
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const cookie = request.cookies.get(SESSION_COOKIE)?.value ?? ''
  const valid = await verifyEdgeSession(cookie)
  if (!valid) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
