import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { getInquiries } from '@/lib/kv'
import { getSiteConfig, getGallery, getVideos, getMixes } from '@/lib/data'
import AdminTable from '@/components/AdminTable'
import ImageUploadPanel from '@/components/ImageUploadPanel'
import VideosAdminPanel from '@/components/VideosAdminPanel'
import MixesAdminPanel from '@/components/MixesAdminPanel'
import AdminTabs from '@/components/AdminTabs'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  if (!session || !verifySession(session)) redirect('/admin/login')

  const [inquiries, siteConfig, galleryItems, videos, mixes] = await Promise.all([
    getInquiries(),
    getSiteConfig(),
    getGallery(),
    getVideos(),
    getMixes(),
  ])

  return (
    <div className="min-h-screen bg-black px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-bebas text-4xl text-white uppercase tracking-wide">Admin</h1>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="font-mono text-xs text-white/30 hover:text-white transition-colors">
              Log out
            </button>
          </form>
        </div>

        <AdminTabs tabs={[
          {
            id: 'inquiries',
            label: 'Inquiries',
            content: <AdminTable initialInquiries={inquiries} />,
          },
          {
            id: 'images',
            label: 'Images',
            content: (
              <ImageUploadPanel
                heroImage={siteConfig.heroImage}
                aboutImage={siteConfig.aboutImage}
                videosImage={siteConfig.videosImage}
                mixesImage={siteConfig.mixesImage}
                bookingImage={siteConfig.bookingImage}
                galleryItems={galleryItems}
              />
            ),
          },
          {
            id: 'videos',
            label: 'Videos',
            content: <VideosAdminPanel initialItems={videos} />,
          },
          {
            id: 'mixes',
            label: 'Mixes',
            content: <MixesAdminPanel initialItems={mixes} />,
          },
        ]} />
      </div>
    </div>
  )
}
