import type { Metadata, Viewport } from 'next'
import './globals.css'
import { clsx } from 'clsx'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#dce8f0'
}

export const metadata: Metadata = {
  title: 'Free QR Code Generator — Direct Links, No Redirects, No Sign Up',
  description: 'Generate free QR codes that link directly to your URL — no redirects, no tracking, no account needed. Download as PNG, SVG, or JPG instantly.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Free QR Code'
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "OpenQR",
  "alternateName": "Free QR Code Generator",
  "url": "https://openqr.dev",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "description": "Generate free QR codes that link directly to your URL — no redirects, no tracking, no account needed. Download high-resolution PNG, SVG, or JPG QR codes instantly for commercial or personal use.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "keywords": "free QR code generator no redirect, QR code generator without tracking, free QR code no sign up, QR code generator no account required, direct QR code generator, create QR code free"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={clsx('min-h-screen antialiased')}>
        {children}
      </body>
    </html>
  )
}
