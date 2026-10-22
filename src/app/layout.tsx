import React from 'react'
import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Provider from "@/util/provider";

export const metadata: Metadata = {
  title: "Statrix",
  description: "Showcase your gaming identity",
  icons: "/logos/favicon.ico"
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="icon" href="/logos/favicon.ico" />
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