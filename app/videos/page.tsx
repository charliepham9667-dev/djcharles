import { getVideos, getSiteConfig } from '@/lib/data'
import VideosPageContent from '@/components/VideosPageContent'

export const dynamic = 'force-dynamic'

export default async function VideosPage() {
  const [videos, { videosImage }] = await Promise.all([getVideos(), getSiteConfig()])
  return <VideosPageContent videos={videos} videosImage={videosImage} />
}
