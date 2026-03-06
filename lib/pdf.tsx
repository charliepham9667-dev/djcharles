import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    padding: 48,
    fontFamily: 'Helvetica',
  },
  gold: { color: '#C9A84C' },
  header: {
    marginBottom: 32,
    borderBottom: '1px solid #C9A84C',
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    color: '#C9A84C',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 6,
    letterSpacing: 2,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#C9A84C',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
    borderBottom: '0.5px solid #C9A84C44',
    paddingBottom: 6,
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '0.5px solid #FFFFFF14',
  },
  packageName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  packageDesc: {
    fontSize: 9,
    color: '#FFFFFF99',
    marginTop: 2,
  },
  packagePrice: {
    fontSize: 11,
    color: '#C9A84C',
    fontFamily: 'Helvetica-Bold',
  },
  note: {
    fontSize: 9,
    color: '#FFFFFF66',
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    borderTop: '0.5px solid #C9A84C44',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 8, color: '#FFFFFF4D' },
})

const PACKAGES = [
  {
    name: 'Basic Set',
    desc: '2 hours · Standard equipment · 1 consultation call',
    price: 'From NOK 5,000',
  },
  {
    name: 'Extended Set',
    desc: '4 hours · Premium equipment · Sound system coordination',
    price: 'From NOK 9,000',
  },
  {
    name: 'Full Night',
    desc: '6+ hours · All-inclusive · Lighting input · Full production support',
    price: 'From NOK 15,000',
  },
  {
    name: 'Custom',
    desc: 'Bespoke package tailored to your event · Contact for details',
    price: 'On request',
  },
]

interface RateCardProps {
  clientName: string
  eventType: string
  eventDate: string
  selectedPackage: string
}

export function RateCardPDF({
  clientName,
  eventType,
  eventDate,
  selectedPackage,
}: RateCardProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DJ Charle$</Text>
          <Text style={styles.tagline}>WHERE EVERY SET TELLS A STORY</Text>
        </View>

        {/* Prepared for */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prepared For</Text>
          <Text style={{ fontSize: 12, color: '#FFFFFF' }}>{clientName}</Text>
          <Text style={{ fontSize: 10, color: '#FFFFFF80', marginTop: 4 }}>
            {eventType} · {eventDate}
          </Text>
        </View>

        {/* Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Packages &amp; Rates</Text>
          {PACKAGES.map((pkg) => (
            <View
              key={pkg.name}
              style={[
                styles.packageRow,
                pkg.name === selectedPackage
                  ? { backgroundColor: '#C9A84C0F', padding: 6 }
                  : {},
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.packageName}>
                  {pkg.name}
                  {pkg.name === selectedPackage ? '  ✓ Selected' : ''}
                </Text>
                <Text style={styles.packageDesc}>{pkg.desc}</Text>
              </View>
              <Text style={styles.packagePrice}>{pkg.price}</Text>
            </View>
          ))}
          <Text style={styles.note}>
            * All rates are starting prices and are customized based on event details, location,
            duration, and technical requirements.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={{ fontSize: 10, color: '#FFFFFF99' }}>placeholder@djcharles.com</Text>
          <Text style={{ fontSize: 10, color: '#FFFFFF66', marginTop: 4 }}>
            I&apos;ll be in touch within 24 hours to discuss your event in detail.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>© 2026 DJ Charle$ · Confidential Rate Card</Text>
          <Text style={styles.footerText}>djcharles.com</Text>
        </View>
      </Page>
    </Document>
  )
}
