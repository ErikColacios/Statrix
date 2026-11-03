import React from "react"
import type { Metadata } from "next"
import LandingPage from "@/components/landing/LandingPage"

const title = "Statrix: Social Game Tracker. Log, Rate & Review your Games"
const description = "Track the games you play, rate them, build ranked lists, write reviews and chat with friends. Import your Steam library in one click."

// The landing is a client component, so its metadata lives in this server page.
// The image comes from src/app/opengraph-image.tsx
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Statrix",
    locale: "en_US",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function Home() {
  return <LandingPage />
}
