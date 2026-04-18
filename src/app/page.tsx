import React from "react"
import Link from "next/link"
import localFont from 'next/font/local'
import PrimaryButton from "@/components/PrimaryButton"

const infiniteBeyondFont = localFont({ src: '../fonts/InfiniteBeyondItalic-rgPlO.ttf' })

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15),transparent_70%)] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(34,197,94,0.1),transparent_70%)] blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 h-screen w-full px-8 flex items-center justify-center text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-400 text-sm uppercase tracking-widest mb-4">Alpha version</p>
          <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter mb-6 animate-fade-in leading-none" style={{backgroundImage: 'linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #86efac 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', textShadow: '0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.3)', WebkitTextStroke: '1px rgba(34, 197, 94, 0.3)'}}>
            Your Gaming Home
          </h1>
          <p className="text-gray-400 mt-6 text-xl animate-fade-in delay-200 leading-relaxed">
            Track your gaming journey, discover thousands of titles, share reviews, and connect with gamers worldwide.
          </p>
          <div className="mt-12 flex justify-center gap-4 animate-fade-in delay-400">
            <Link href="/signup">
              <PrimaryButton text="Start now" />
            </Link>
            <button className="backdrop-blur-sm bg-white/10 border border-green-500/30 text-white hover:bg-white/20 hover:border-green-400 rounded-xl px-6 sm:px-8 py-2 sm:py-3 transition-all text-base sm:text-lg font-medium">
              Browse Games
            </button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-white/5 border-t border-white/20 px-8 py-10 text-center">
        <p className="text-gray-500">© {new Date().getFullYear()} Statrix. The gaming platform for gamers, by gamers.</p>
      </footer>
    </main>
  );
}