import React from 'react'
import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Provider from "@/util/provider";

export const metadata: Metadata = {
  // Turns relative URLs (like the Open Graph image) into absolute ones, which social networks need
  metadataBase: new URL("https://statrix.app"),
  title: "Statrix: Social Game Tracker. Log, Rate & Review your Games",
  description: "Showcase your gaming identity",
  icons: "/logos/favicon.ico",
  // Defaults for every page. A page that sets its own openGraph replaces this whole object, it isn't merged.
  // The image comes from src/app/opengraph-image.tsx
  openGraph: {
    title: "Statrix: Social Game Tracker. Log, Rate & Review your Games",
    description: "Showcase your gaming identity",
    siteName: "Statrix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="icon" href="/logos/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>
      </head>
      <body className='bg-black relative'>
        <Provider>
          <Navbar />
          <div>
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}