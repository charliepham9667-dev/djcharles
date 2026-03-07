export interface Video {
  id: string
  title: string
  location: string
  date: string
  category: 'Club' | 'Private' | 'Festival' | 'Other'
  youtubeId: string
  videoUrl?: string    // uploaded video file; takes priority over youtubeId if set
  thumbnailUrl?: string // custom thumbnail image for uploaded videos
}

export interface Mix {
  id: string
  title: string
  date: string
  duration: string
  platform: 'soundcloud' | 'youtube'
  embedUrl: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  event: string
  date: string
}

export type InquiryStatus = 'New' | 'In Progress' | 'Confirmed' | 'Declined'

export interface Inquiry {
  id: string
  name: string
  email: string
  eventType: string
  eventDate: string
  location: string
  guestCount: string
  package: string
  message: string
  submittedAt: string
  status: InquiryStatus
}

export type BookingFormData = Omit<Inquiry, 'id' | 'submittedAt' | 'status'>
