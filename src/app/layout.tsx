import type { Metadata, Viewport } from 'next'
import './globals.css'
import { clsx } from 'clsx'

const appName = 'OpenQR'
const appUrl = 'https://openqr.dev'
const authorName = 'Nivin P Louis'
const authorGithub = 'https://github.com/NivinLouis'
const authorLinkedIn = 'https://www.linkedin.com/in/nivin-louis/'
const description = 'OpenQR is a free QR code generator for direct links and instant downloads, developed by Nivin P Louis.'
const keywords = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Apps',
  'React',
  'Next.js',
  'Vibe Coding',
  'Free QR Code Generator',
  'QR Code Generator',
  'Direct QR Codes'
]

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#dce8f0'
}

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: `${appName} - Free QR code generator with direct links and instant downloads | developed by Nivin P Louis`,
  description,
  applicationName: appName,
  authors: [{ name: authorName, url: authorGithub }],
  creator: authorName,
  publisher: authorName,
  keywords,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: `${appName} | ${authorName}`,
    description,
    url: appUrl,
    type: 'website',
    siteName: appName
  },
  other: {
    author: authorName
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: appName
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: appName,
  alternateName: 'Free QR Code Generator',
  url: appUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  description,
  keywords: keywords.join(', '),
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  author: {
    '@type': 'Person',
    name: authorName,
    url: authorGithub,
    sameAs: [authorGithub, authorLinkedIn]
  }
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
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-slate-200/80 bg-white/75 px-4 py-5 text-sm text-slate-700 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Built by {authorName} ·{' '}
                <a href={authorGithub} target="_blank" rel="noreferrer" className="font-medium text-slate-900 hover:underline">
                  GitHub
                </a>{' '}
                ·{' '}
                <a href={authorLinkedIn} target="_blank" rel="noreferrer" className="font-medium text-slate-900 hover:underline">
                  LinkedIn
                </a>
              </p>
              <a href="mailto:nivinlouis123@gmail.com" className="hover:underline">
                nivinlouis123@gmail.com
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
