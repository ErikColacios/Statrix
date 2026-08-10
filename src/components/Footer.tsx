import Link from 'next/link';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id='footer' className="absolute bottom-0 h-12 w-full flex flex-col sm:flex-row justify-center items-center bg-black text-white text-sm sm:space-x-20 px-12 py-8">
      <div className='flex items-center text-gray-400'>
        <p>@ {currentYear} Statrix</p>
        <p className='ml-4 mr-1'>Game data by</p>
        <Link href="https://www.igdb.com/" target="_blank" rel="noopener noreferrer">
          <img src="/staticImages/IgdbLogoWhite.png" alt="IGDB logo" className="w-10" />
        </Link>
      </div>
      <div className='flex space-x-4'>
        <Link href="/" className='hover:text-green-500'>Privacy policy</Link>
        <Link href="/" className='hover:text-green-500'>Terms of use</Link>
      </div>
    </footer>
  )
}