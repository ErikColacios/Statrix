import React from "react"
import Link from "next/link"
import localFont from 'next/font/local'
import PrimaryButton from "@/components/PrimaryButton"

const infiniteBeyondFont = localFont({ src: '../fonts/InfiniteBeyondItalic-rgPlO.ttf' })


export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="px-8 py-52 text-center max-w-4xl mx-auto">
        <p className="text-gray-400 ml-4">Alpha version</p>
        <h1 className={`${infiniteBeyondFont.className} tracking-wider pl-1 text-green-400 text-4xl`}>STATRIX</h1>
        <p className="mt-6 text-lg text-gray-300">
          Build your gaming profile, discover new titles, rate and review
          games, and connect with friends in a vibrant community of players.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href={'/login'}><PrimaryButton text="Get started"/></Link>
          <button
            className="border-green-500 text-green-400 hover:bg-green-900/30 rounded-xl px-6 py-3 text-lg"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-green-400 mb-16">
          What You Can Do with Statrix
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 rounded-2xl bg-gray-800/60 border border-green-900/40 shadow-lg hover:shadow-green-500/20 transition">
            <h4 className="text-xl font-semibold mb-3">Game Database</h4>
            <p className="text-gray-300">
              Browse thousands of games with detailed stats, ratings, and
              reviews from players worldwide.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-800/60 border border-green-900/40 shadow-lg hover:shadow-green-500/20 transition">
            <h4 className="text-xl font-semibold mb-3">Personal Lists</h4>
            <p className="text-gray-300">
              Create custom collections of your favorite games, backlog, and
              must-play titles.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-800/60 border border-green-900/40 shadow-lg hover:shadow-green-500/20 transition">
            <h4 className="text-xl font-semibold mb-3">Social Features</h4>
            <p className="text-gray-300">
              Connect with friends, share your profile, and explore the gaming
              journeys of others.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="community"
        className="px-8 py-24 bg-gradient-to-r from-green-900/40 via-green-800/20 to-green-900/40 text-center"
      >
        <h3 className="text-3xl font-bold text-green-400 mb-6">
          Join the Statrix Community
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto mb-10">
          Whether you’re a casual gamer or a hardcore completionist, Statrix is
          the place to showcase your gaming identity and connect with like-minded players.
        </p>
        <Link href={'/signup'}><PrimaryButton text="Create your profile"/></Link>

      </section>

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-green-900/40 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Statrix. All rights reserved.
      </footer>
    </main>
  );
}
