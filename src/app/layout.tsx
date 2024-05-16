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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roobertRegularFont.className}>
        <Navbar/>
        <div className="bg-black">
          {children}
        </div>
        </body>
    </html>
  );
}
