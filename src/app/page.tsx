"use client"
import React from "react"
import Link from "next/link"
import List from "@/components/List"
import Review from "@/components/Review"
import ChatBox from "@/components/ChatBox"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"

export default function Home() {

  const list1 = {
    listName: "Pure cinema", listGames: 23, listCreationDate: "2026-06-24", covers: [{ gameBaseImage: "/staticImages/game_covers/cover_cyberpunk2077.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_need_for_speed_mw.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_hollow_knight_silksong.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_red_dead_redemption2.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_death_stranding2.jpg" }]
  }

  const list2 = {
    listName: "Horror", listGames: 16, listCreationDate: "2026-04-03", covers: [{ gameBaseImage: "/staticImages/game_covers/cover_resident_evil5.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_silent_hill2.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_alien_isolation.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_outlast2.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_subnautica.jpg" }]
  }

  const reviews = [
    { userName: "NukeGuy", avatarImage: "/avatarImages/solid_snake.jpg", reviewDate: "2026-06-15", recommended: true, likes: 12, body: "This game is amazing! The graphics are stunning and the gameplay is smooth. I highly recommend it to anyone who loves action-adventure games." },
    { userName: "Furroman", avatarImage: "/avatarImages/master_chief.jpg", reviewDate: "2026-06-14", recommended: false, likes: 3, body: "I was really disappointed with this game. The story was weak and the controls were clunky. I wouldn't recommend it to anyone." },
    { userName: "Daxter", avatarImage: "/avatarImages/sonic.jpg", reviewDate: "2026-06-13", recommended: true, likes: 8, body: "This game exceeded my expectations. The open world is vast and immersive, and the side quests are engaging. I can't wait to see what the developers do next." },
    { userName: "Chrono", avatarImage: "/avatarImages/link.jpg", reviewDate: "2026-06-12", recommended: false, likes: 1, body: "I found this game to be very repetitive and boring. The combat system is unbalanced and the AI is terrible. I wouldn't recommend it to anyone." },
  ]

  const messages = [
    { senderId: 2, senderName: "Dr.Storm", createdAt: "2026-06-15", avatarImage: "/avatarImages/sonic.jpg", text: "You too, wp. Let's play again some time!" },
    { senderId: 1, senderName: "NukeGuy", createdAt: "2026-06-15", avatarImage: "/avatarImages/sonic.jpg", text: "GGs man!" },
    { senderId: 2, senderName: "Dr.Storm", createdAt: "2026-06-14", avatarImage: "/avatarImages/sonic.jpg", text: "Yeah give me 3 minutes im going to the toilet" },
    { senderId: 1, senderName: "NukeGuy", createdAt: "2026-06-14", avatarImage: "/avatarImages/sonic.jpg", text: "Join my lobby when you are ready!" },
    { senderId: 2, senderName: "Dr.Storm", createdAt: "2026-06-14", avatarImage: "/avatarImages/solid_snake.jpg", text: "Accepted" },
    { senderId: 1, senderName: "NukeGuy", createdAt: "2026-06-14", avatarImage: "/avatarImages/solid_snake.jpg", text: "Got it, did you receive it?" },
    { senderId: 2, senderName: "Dr.Storm", createdAt: "2026-06-14", avatarImage: "/avatarImages/sonic.jpg", text: "Sure. Add me on Steam, my username is NukeGuy (like here)" },
    { senderId: 1, senderName: "NukeGuy", createdAt: "2026-06-14", avatarImage: "/avatarImages/solid_snake.jpg", text: "Hi! You wanna go play some Apex? We need one more to fill the squad" },
  ]


  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Hero section */}
      <section className="relative z-10 h-screen w-full px-8 flex flex-col items-center justify-center text-center">
        <div className="animate-bounce flex items-center bg-green-600/20 text-green-400 border border-green-500/30 rounded-full px-4 py-1 mb-8">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Alpha version
        </div>
        <h1 className="flex flex-col text-5xl sm:text-7xl font-bold">
          One Platform to Track, Share and
          <span className="bg-clip-text text-transparent bg-linear-to-r from-green-400 to-lime-500">Connect</span>
        </h1>
        <p className="md:w-1/2 text-gray-400 mt-6 text-base sm:text-xl">
          Discover players who love the same games you do. Log your progress, publish reviews, build your gaming identity, and connect with a community that truly shares your interests.
        </p>
        <div className="mt-12 flex justify-center gap-4 animate-fade-in delay-400">
          <Link href="/signup" className="sm:w-48 text-md sm:text-lg text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
            Start now
          </Link>
          <Link href={'/browseGames'} className="sm:w-48 backdrop-blur-xs bg-white/10 border border-green-500/30 text-white hover:bg-white/20 hover:border-green-400 rounded-xl px-4 sm:px-8 py-2 sm:py-3 transition-all text-base sm:text-lg">
            Browse Games
          </Link>
        </div>
      </section>

      {/* About section */}
      <motion.div className="w-full flex flex-col p-6 xl:p-20"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true, amount: 0.3 }}>
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8 text-gray-400 mt-6 text-base md:text-xl">
          <div className="lg:w-1/2">
            <h2 className="flex flex-col text-4xl sm:text-6xl font-bold text-white mb-6">
              More than a game tracker
            </h2>
            <p>Statrix works perfectly as a self game-tracking platform. Here you can search any game that you ever played, rate it and save it to your backlog in seconds. All your gaming history in one place.</p>
            <p className="text-white mt-1">Beyond of that, we want to focus more on the social aspect of gaming, because sometimes it gets hard to find people who play the same games or has the same interests. </p>
            <p className="text-white">This site provides tools to help share with the world what type of player you are, and display the passion you put into it.</p>
          </div>
          <img src="/staticImages/statrix_profile.jpg" alt="Statrix profile" className=" lg:w-1/2 rounded-2xl mt-8 lg:mt-0" />
        </div>
      </motion.div>

      {/* Features section */}
      <section className="flex flex-col p-6 xl:p-16 space-y-40">
        <div className="flex flex-col md:flex-row md:items-center justify-center md:space-x-12">
          <div className="md:w-1/5 mb-4">
            <h3 className="text-3xl sm:text-4xl font-semibold mb-2">Make your lists</h3>
            <p className="text-2xl text-gray-400">Create lists, rate games, and set your progress for each title.</p>
          </div>
          <div className="md:w-3/5 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <motion.div className="w-full"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <List list={list1} />
            </motion.div>
            <motion.div className="w-full"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <List list={list2} />
            </motion.div>
          </div>
        </div>


        {/* Reviews section */}
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-12">
          <div className="md:w-2/5 flex flex-col order-2 md:order-1">
            {reviews?.map((review: any, index: number) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true, amount: 0.3 }} >
                <Review review={review} index={index} />
              </motion.div>

            ))}
          </div>


          <motion.div className="md:w-2/5 xl:w-1/5 order-1 md:order-2 mb-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}>
            <h3 className="text-3xl sm:text-4xl font-semibold mb-2">Write reviews</h3>
            <p className="text-2xl text-gray-400">Share your thoughts about the games you love, or those that not so much...</p>
          </motion.div>
        </div>


        {/* Chat section */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-center sm:space-x-12">
          <motion.div className="lg:w-1/5 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}>
            <h3 className="text-3xl sm:text-4xl font-semibold mb-2">Connect with other players</h3>
            <p className="text-2xl text-gray-400">Chat with friends and gather a new squad to play.</p>
          </motion.div>
          <motion.div className="sm:w-2/5 flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}>
            <ChatBox messages={messages} />
          </motion.div>
        </div>

      </section>


      {/* Coming soon section */}
      <section className="flex flex-col p-8 xl:p-16 mt-32 items-center">
        <motion.div className="flex flex-col items-center justify-center w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}>
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">What's in the future?</h2>
          <p className="md:w-1/2 text-base text-gray-400 md:text-xl md:text-center">This is an early version of the app, so expect more cool functionalities in the future.
            We've got tons of ideas that we will end up bringing to life, but for now in the upcoming months, we plan to deliver these new tools for you to start using</p>
        </motion.div>


        <div className="grid md:grid-cols-2 2xl:grid-cols-4 gap-4 items-center space-y-4 md:space-y-0 mt-8">

          <motion.div className="bg-[url('/staticImages/bg_subnautica.jpg')] bg-cover w-96 h-96 rounded-2xl flex flex-col justify-end overflow-hidden"
            initial={{ opacity: 0, y: 120, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}>
            <div className="p-6 backdrop-blur-md w-full">
              <h3 className="text-2xl font-bold ">Social feed</h3>
              <p>Share posts, screenshots, opinions and moments with the community in a <i className="italic">Twitter</i> style dashboard oriented on gaming.</p>
            </div>
          </motion.div>

          <motion.div className="bg-[url('/staticImages/bg_monster_hunter.jpg')] bg-cover w-96 h-96 rounded-2xl flex flex-col justify-end overflow-hidden"
            initial={{ opacity: 0, y: 120, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}>
            <div className="p-6 backdrop-blur-md w-full">
              <h3 className="text-2xl font-bold">Multiplatform imports</h3>
              <p>Import your games into your library from other gaming networks like Steam, Playstation or Xbox.</p>
            </div>
          </motion.div>

          <motion.div className="bg-[url('/staticImages/bg_rapture.jpg')] bg-cover bg-center w-96 h-96 rounded-2xl flex flex-col justify-end overflow-hidden"
            initial={{ opacity: 0, y: 120, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}>
            <div className="p-6 backdrop-blur-md w-full">
              <h3 className="text-2xl font-bold">Enhanced customization</h3>
              <p>Upload your own avatars and banners directly from your device. More widgets available and themes for your profile.</p>
            </div>
          </motion.div>

          <motion.div className="bg-[url('/staticImages/bg_resident_evil.jpg')] bg-cover bg-center w-96 h-96 rounded-2xl flex flex-col justify-end overflow-hidden"
            initial={{ opacity: 0, y: 120, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}>
            <div className="p-6 backdrop-blur-md w-full">
              <h3 className="text-2xl font-bold">Mobile app</h3>
              <p>Access to your account from a mobile or tablet. It will be available for both iOS and Android.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full flex flex-col sm:flex-row sm:items-center justify-center h-[50vh] text-base md:text-xl p-6 pb-12 xl:p-20 my-20">
        <div className="lg:w-1/2">
          <h2 className="flex text-4xl sm:text-6xl font-bold mb-6">Ready to jump in?</h2>
          <p className="text-gray-400">You can sign up via Google or you can create an account on the traditional way.</p>
          <p>And of course, this is all for free.</p>
          <div className="mt-4 sm:mt-12 flex gap-4 animate-fade-in delay-400">
            <Link href="/signup" className="text-md sm:text-lg text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
              Start now
            </Link>
            <Link href={'/browseGames'} className="backdrop-blur-xs bg-white/10 border border-green-500/30 text-white hover:bg-white/20 hover:border-green-400 rounded-xl px-4 sm:px-8 py-2 sm:py-3 transition-all text-base sm:text-lg">
              Browse Games
            </Link>
          </div>
        </div>
        <div>
          <img src="/logos/st2_white.png" alt="Statrix logo" className="py-8 w-52 sm:w-96" />
        </div>
      </section>

      <Footer />
    </main>
  );
}