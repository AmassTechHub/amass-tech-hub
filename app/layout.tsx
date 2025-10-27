import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Amass Tech Hub - Africa's Premier Tech News & Solutions",
  description:
    "Your go-to source for tech news, reviews, tutorials, and digital solutions across Africa. Stay ahead with breaking tech news and expert insights.",
  keywords: [
    "tech news Africa",
    "technology reviews",
    "programming tutorials",
    "digital solutions",
    "tech tools",
    "African tech",
  ],
  authors: [{ name: "Amass Tech Hub" }],
  creator: "Amass Tech Hub",
  publisher: "Amass Tech Hub",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.amasstechhub.com",
    siteName: "Amass Tech Hub",
    title: "Amass Tech Hub - Africa's Premier Tech News & Solutions",
    description: "Your go-to source for tech news, reviews, tutorials, and digital solutions across Africa.",
    images: [
      {
        url: "https://www.amasstechhub.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Amass Tech Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amass Tech Hub - Africa's Premier Tech News & Solutions",
    description: "Your go-to source for tech news, reviews, tutorials, and digital solutions across Africa.",
    creator: "@amasstechhub",
    images: ["https://www.amasstechhub.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.amasstechhub.com",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3c0a6b" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Amass Tech Hub",
              url: "https://www.amasstechhub.com",
              logo: "https://www.amasstechhub.com/logo.png",
              description: "Africa's premier tech news and digital solutions hub",
              sameAs: [
                "https://facebook.com/amasstechhub",
                "https://instagram.com/amasstechhub",
                "https://twitter.com/amasstechhub",
                "https://youtube.com/@amasstechhub",
                "https://linkedin.com/company/amasstechhub",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "info@amasstechhub.com",
              },
            }),
          }}
        />

        {/* Structured Data - Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Amass Tech Hub",
              url: "https://www.amasstechhub.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.amasstechhub.com/news?search={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
