import React from 'react'
import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import Navbar from "./components/Navbar";

const roobertRegularFont = localFont({src: 'fonts/RoobertRegular.ttf'})

export const metadata: Metadata = {
  title: "Statrix",
  description: "Videogame list creator",
  icons: "/staticImages/statrix_favicon.png"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className='bg-black'>
        <Navbar />
        <div className={`${roobertRegularFont.className} bg-[url(/staticImages/preview.jpg)] bg-cover`}>
          {children}
        </div>
        </body>
    </html>
  );
}
