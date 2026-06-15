import Link from 'next/link';
import React from 'react';

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/"><img src={`/logos/st2_white.png`} className="w-32 hidden sm:flex" alt="Statrix Logo" /></Link>
      </div>
    </footer>
  );
};
