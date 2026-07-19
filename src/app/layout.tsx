import React from 'react'
import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Provider from "@/util/provider";
import getSessionUser from '@/actions/getSessionUser';

export const metadata: Metadata = {
  title: "Statrix",
  description: "Showcase your gaming identity",
  icons: "/logos/st_favicon.png"
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
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
