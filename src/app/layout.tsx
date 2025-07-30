import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Scoreboard Hub",
  description: "Digital scoreboards for Kachuful, Hearts, and other card games",
  generator: "v0.dev",
  keywords: ["scoreboard", "card games", "hearts", "kachuful", "score tracking"],
  authors: [{ name: "Scoreboard Hub" }],
  robots: "index, follow",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Google AdSense */}
        {adsenseClientId && process.env.NODE_ENV === "production" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Preconnect to AdSense domains for better performance */}
        {process.env.NODE_ENV === "production" && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
            <link rel="preconnect" href="https://www.google.com" />
          </>
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
