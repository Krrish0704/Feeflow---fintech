import type { Metadata, Viewport } from 'next'
import { Inter, Sora, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  title: 'FeeFlow — Institutional Fee Intelligence for Indian Schools',
  description:
    'FeeFlow is an elite school fintech platform. A JSONB-driven rule engine, maker-checker governance, and a tamper-proof ledger that scales fee operations across Lakhs and Crores.',
  generator: 'v0.app',
  keywords: ['school fintech', 'fee management', 'India', 'maker-checker', 'ledger', 'FeeFlow'],
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#211a12',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark inter" suppressHydrationWarning={true}>
      <body 
        className="font-sans antialiased bg-neutral-950 text-neutral-100 min-h-screen"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}