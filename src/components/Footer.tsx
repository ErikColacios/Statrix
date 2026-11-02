import Link from 'next/link';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id='footer' className="absolute bottom-0 w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-0 bg-black text-white text-sm sm:space-x-20 px-12 py-4 sm:h-12 sm:py-8">
      <div className='flex items-center text-gray-400'>
        <p>@ {currentYear} Statrix</p>
        <p className='ml-4 mr-1'>Game data by</p>
        <Link href="https://www.igdb.com/" target="_blank" rel="noopener noreferrer">
          <img src="/staticImages/IgdbLogoWhite.png" alt="IGDB logo" className="w-10" />
        </Link>
      </div>
      <div className='flex flex-col sm:flex-row items-center gap-1 sm:gap-0 sm:space-x-4'>
        <Link href="/privacy-policy" className='hover:text-green-500'>Privacy policy</Link>
        <Link href="/terms" className='hover:text-green-500'>Terms of use</Link>
        <p className='text-gray-400'>contact@statrix.app</p>
      </div>
    </footer>
  )
}
