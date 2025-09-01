import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Inter, Merriweather, Open_Sans, Work_Sans } from "next/font/google"
import Navbar from "@/components/navbar"
import { Suspense } from "react"
import { I18nProvider } from "@/components/i18n-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-serif",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["600", "700"],
})

export const metadata: Metadata = {
  title: "KalpavrikshaAI - Empowering Artisans with AI",
  description: "Created with Next.js",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${workSans.variable} antialiased`}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-dvh bg-background text-foreground`}>
        <I18nProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">{children}</main>
          </Suspense>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
