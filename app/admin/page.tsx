import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { getInquiries } from '@/lib/kv'
import AdminTable from '@/components/AdminTable'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  if (!session || !verifySession(session)) redirect('/admin/login')

  const inquiries = await getInquiries()

  return (
    <div className="min-h-screen bg-black px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-spartan font-black text-4xl text-white uppercase">Inquiries</h1>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="font-mono text-xs text-white/30 hover:text-white transition-colors">
              Log out
            </button>
          </form>
        </div>
        <AdminTable initialInquiries={inquiries} />
      </div>
    </div>
  )
}
