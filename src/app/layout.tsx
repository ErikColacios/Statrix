import React from 'react'
import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import Navbar from "./components/Navbar";
import Head from "./head";

const roobertRegularFont = localFont({src: 'fonts/RoobertRegular.ttf'})

export const metadata: Metadata = {
  title: "Statrix",
  description: "Videogame list creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head/>
      <body className={roobertRegularFont.className}>
        <Navbar/>
        <div className="h-screen bg-black">
          {children}
        </div>
        </body>
    </html>
  );
}
