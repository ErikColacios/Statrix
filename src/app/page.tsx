import React from "react"
import Link from "next/link"
import localFont from 'next/font/local'
import PrimaryButton from "@/components/PrimaryButton"
import getSessionUser from "@/actions/getSessionUser"
import { redirect } from "next/navigation"

export default async function Home() {

  const session: any = await getSessionUser()

  if (session?.user.isNewUser) {
    redirect("/newUser")
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Hero Section */}
      <section className="relative z-10 h-screen w-full px-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center bg-green-600/20 text-green-400 border border-green-500/30 rounded-full px-4 py-1 mb-8">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Alpha version
        </div>
        <h1 className="flex flex-col text-5xl sm:text-7xl font-bold">
          One Platform to Track, Share and
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-lime-500">Connect</span>
        </h1>
        <p className="md:w-1/2 text-gray-400 mt-6 text-base sm:text-xl">
          Discover players who love the same games you do. Log your progress, publish reviews, build your gaming identity, and connect with a community that truly shares your interests.
        </p>
        <div className="mt-12 flex justify-center gap-4 animate-fade-in delay-400">
          <Link href="/signup">
            <PrimaryButton text="Start now" />
          </Link>
          <Link href={'/browseGames'} className="backdrop-blur-sm bg-white/10 border border-green-500/30 text-white hover:bg-white/20 hover:border-green-400 rounded-xl px-6 sm:px-8 py-2 sm:py-3 transition-all text-base sm:text-lg font-medium">
            Browse Games
          </Link>
        </div>
      </section>

      <section className="w-full flex flex-col p-6 xl:p-20">
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8 text-gray-400 mt-6 text-base md:text-xl">
          <div className="lg:w-1/2">
            <h2 className="flex flex-col text-5xl sm:text-6xl font-bold text-white mb-6">
              More than a game tracker
            </h2>
            <p>Statrix works perfectly as a self game-tracking platform. Here you can search any game that you ever played, rate it and save it to your backlogg in seconds. All your gaming history in one place.</p>
            <p className="text-white">Beyond of that, we want to focus more on the social aspect of gaming, because sometimes it gets hard to connect with people who play the same games or has the same interests. </p>
            <p className="text-white">This site provides tools to help share with the world what type of player you are, and display the passion you put into it.</p>
          </div>
          <img src="/staticImages/statrix_profile.jpg" alt="Statrix profile" className="lg:w-1/2 rounded-2xl mt-8 lg:mt-0" />
        </div>


      </section>

    </main>
  );
}