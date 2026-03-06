import { Resend } from 'resend'
import type { Inquiry } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendClientEmail(inquiry: Inquiry, pdfBuffer: Buffer): Promise<void> {
  await resend.emails.send({
    from: 'DJ Charle$ <noreply@djcharles.com>',
    to: [inquiry.email],
    subject: 'DJ Charle$ — Your Rate Card',
    html: `
      <div style="background:#000;color:#fff;font-family:sans-serif;padding:32px;max-width:600px">
        <h1 style="color:#C9A84C;font-size:28px;margin-bottom:8px">DJ Charle$</h1>
        <p style="color:rgba(255,255,255,0.6);margin-bottom:24px">Where Every Set Tells a Story</p>
        <p>Hi ${inquiry.name},</p>
        <p>Thank you for reaching out about your <strong>${inquiry.eventType}</strong> on <strong>${inquiry.eventDate}</strong> in <strong>${inquiry.location}</strong>.</p>
        <p>I've attached a rate card with package details. All rates are starting points — I'll be in touch within 24 hours to discuss your event in detail.</p>
        <p style="margin-top:32px;color:rgba(255,255,255,0.4);font-size:12px">© 2026 DJ Charle$</p>
      </div>
    `,
    attachments: [
      {
        filename: 'DJCharles-RateCard.pdf',
        content: pdfBuffer.toString('base64'),
      },
    ],
  })
}

export async function sendAdminEmail(inquiry: Inquiry): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL!
  const rows = Object.entries({
    Name: inquiry.name,
    Email: inquiry.email,
    'Event Type': inquiry.eventType,
    'Event Date': inquiry.eventDate,
    Location: inquiry.location,
    'Guest Count': inquiry.guestCount,
    Package: inquiry.package,
    Submitted: new Date(inquiry.submittedAt).toLocaleString(),
  })
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">${k}</td><td style="padding:8px;border:1px solid #ddd">${v}</td></tr>`,
    )
    .join('')

  await resend.emails.send({
    from: 'DJ Charle$ Bookings <noreply@djcharles.com>',
    to: [adminEmail],
    subject: `New Booking Inquiry — ${inquiry.eventType}`,
    html: `
      <div style="font-family:sans-serif;padding:24px">
        <h2>New Inquiry from ${inquiry.name}</h2>
        <table style="border-collapse:collapse;width:100%">${rows}</table>
        <h3>Message:</h3>
        <p>${inquiry.message}</p>
      </div>
    `,
  })
}
