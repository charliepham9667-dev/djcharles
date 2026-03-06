import { NextResponse } from 'next/server'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import { RateCardPDF } from '@/lib/pdf'
import { saveInquiry } from '@/lib/kv'
import { sendClientEmail, sendAdminEmail } from '@/lib/email'
import type { BookingFormData } from '@/types'
import React from 'react'

const REQUIRED_FIELDS: (keyof BookingFormData)[] = [
  'name', 'email', 'eventType', 'eventDate', 'location', 'guestCount', 'package', 'message',
]

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<BookingFormData>

    // Validate
    for (const field of REQUIRED_FIELDS) {
      if (!(body[field] as string | undefined)?.trim()) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }

    const data = body as BookingFormData

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // NOTE: KV write is not rolled back if PDF generation or email delivery fails.
    // Resubmissions will produce duplicate inquiry records. A deduplication
    // or retry mechanism should be added before production use.
    const inquiry = await saveInquiry(data)

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(RateCardPDF, {
        clientName: inquiry.name,
        eventType: inquiry.eventType,
        eventDate: inquiry.eventDate,
        selectedPackage: inquiry.package,
      }) as React.ReactElement<DocumentProps>
    )

    // Send emails
    await Promise.all([
      sendClientEmail(inquiry, pdfBuffer),
      sendAdminEmail(inquiry),
    ])

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
