import type { Metadata } from 'next'
import { Bebas_Neue, Space_Mono, Outfit } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'GenLayer Builder Companion',
  description: 'Go from zero to deployed — AI-powered tool for the GenLayer ecosystem.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${spaceMono.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
