import React from "react"
import Link from "next/link"
import PrimaryButton from "@/components/PrimaryButton"
import getSessionUser from "@/actions/getSessionUser"
import { redirect } from "next/navigation"
import List from "@/components/List"
import Review from "@/components/Review"
import ChatBox from "@/components/ChatBox"

export default async function Home() {

  const session: any = await getSessionUser()

  if (session?.user.isNewUser) {
    redirect("/newUser")
  }

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
    { userName: "Mechatronics", avatarImage: "/avatarImages/master_chief.jpg", reviewDate: "2026-06-14", recommended: false, likes: 3, body: "I was really disappointed with this game. The story was weak and the controls were clunky. I wouldn't recommend it to anyone." },
    { userName: "Daxter", avatarImage: "/avatarImages/sonic.jpg", reviewDate: "2026-06-13", recommended: true, likes: 8, body: "This game exceeded my expectations. The open world is vast and immersive, and the side quests are engaging. I can't wait to see what the developers do next." },
    { userName: "Chrono", avatarImage: "/avatarImages/link.jpg", reviewDate: "2026-06-12", recommended: false, likes: 1, body: "I found this game to be very repetitive and boring. The combat system is unbalanced and the AI is terrible. I wouldn't recommend it to anyone." },
  ]

  const messages = [
    { senderId: 2, senderName: "Dr.Storm", createdAt: "2026-06-14", avatarImage: "/avatarImages/sonic.jpg", text: "Join my lobby when you are ready!" },
    { senderId: 1, senderName: "NukeGuy", createdAt: "2026-06-14", avatarImage: "/avatarImages/solid_snake.jpg", text: "Got it" },
    { senderId: 2, senderName: "Dr.Storm", createdAt: "2026-06-14", avatarImage: "/avatarImages/sonic.jpg", text: "Sure. Add me on Steam, my username is NukeGuy (like here)" },
    { senderId: 1, senderName: "NukeGuy", createdAt: "2026-06-14", avatarImage: "/avatarImages/solid_snake.jpg", text: "Hi! You wanna go play some Apex? We need one more to fill the squad" },
  ]


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
          <Link href={'/browseGames'} className="backdrop-blur-sm bg-white/10 border border-green-500/30 text-white hover:bg-white/20 hover:border-green-400 rounded-xl px-6 sm:px-8 py-2 sm:py-3 transition-all text-base sm:text-lg">
            Browse Games
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full flex flex-col p-6 xl:p-20">
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8 text-gray-400 mt-6 text-base md:text-xl">
          <div className="lg:w-1/2">
            <h2 className="flex flex-col text-4xl sm:text-6xl font-bold text-white mb-6">
              More than a game tracker
            </h2>
            <p>Statrix works perfectly as a self game-tracking platform. Here you can search any game that you ever played, rate it and save it to your backlogg in seconds. All your gaming history in one place.</p>
            <p className="text-white">Beyond of that, we want to focus more on the social aspect of gaming, because sometimes it gets hard to connect with people who play the same games or has the same interests. </p>
            <p className="text-white">This site provides tools to help share with the world what type of player you are, and display the passion you put into it.</p>
          </div>
          <img src="/staticImages/statrix_profile.jpg" alt="Statrix profile" className="lg:w-1/2 rounded-2xl mt-8 lg:mt-0" />
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col p-6 xl:p-16">

        <div className="flex items-center justify-center space-x-12 mt-12">
          <div className="w-1/5">
            <h3 className="text-4xl font-semibold mb-2">Make your lists</h3>
            <p className="text-2xl text-gray-400">Create lists, rate games, and set your progress for each title.</p>
          </div>
          <div className="w-3/5 flex space-x-4">
            <List list={list1} />
            <List list={list2} />
          </div>
        </div>


        {/* Write reviews*/}
        <div className="flex items-center justify-center space-x-12 mt-40">
          <div className="w-2/5 flex flex-col w-1/2">
            {reviews?.map((review: any, index: number) => (
              <Review review={review} index={index} />
            ))}
          </div>
          <div className="w-1/5">
            <h3 className="text-4xl font-semibold mb-2">Write reviews</h3>
            <p className="text-2xl text-gray-400">Share your thoughts about the games you love, or those that not so much...</p>
          </div>
        </div>


        {/* Chat */}
        <div className="w-full flex items-center justify-center space-x-12 mt-40">
          <div className="w-1/5">
            <h3 className="text-4xl font-semibold mb-2">Connect with other players</h3>
            <p className="text-2xl text-gray-400">Chat with friends and gather a new squad to play.</p>
          </div>
          <div className="w-2/5 flex flex-col">
            <ChatBox messages={messages} />
          </div>
        </div>

      </section>



      {/* <section className="w-full flex flex-col items-center p-6 mt-12 xl:p-20">
        <h2 className="flex flex-col text-4xl sm:text-6xl font-bold text-white mb-6">Current features</h2>
        <p className="text-gray-400 mb-10">These are the core functionalities of Statrix</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-800/50 border border-gray-700 overflow-hidden rounded-xl">
            <img src="/staticImages/statrix_games.jpg" alt="Statrix games" className="w-full sm:h-80 rounded-lg mb-4 border-b border-gray-600" />
            <div className="px-6 pb-4">
              <h3 className="text-2xl font-semibold mb-2">Discover new stuff</h3>
              <p>Navigate throught a bast database of games and get some inspiration.</p>
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-gray-700 overflow-hidden rounded-xl">
            <img src="/staticImages/statrix_lists.jpg" alt="Statrix lists" className="w-full sm:h-80 rounded-lg mb-4 border-b border-gray-600" />
            <div className="px-6 pb-4">
              <h3 className="text-2xl font-semibold mb-2">Game Tracking</h3>
              <p>Create lists, rate games, and set your progress for each title.</p>
            </div>
          </div>
          
          <div className="bg-zinc-800/50 border border-gray-700 overflow-hidden rounded-xl">
            <img src="/staticImages/statrix_reviews.jpg" alt="Statrix reviews" className="w-full sm:h-80 rounded-lg mb-4 border-b border-gray-600" />
            <div className="px-6 pb-4">
              <h3 className="text-2xl font-semibold mb-2">Write reviews</h3>
              <p>Share your thoughts about the games you love, or those that not so much...</p>
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-gray-700 overflow-hidden rounded-xl">
            <img src="/staticImages/statrix_chat.jpg" alt="Statrix chat" className="w-full sm:h-80 rounded-lg mb-4 border-b border-gray-600" />
            <div className="px-6 pb-4">
              <h3 className="text-2xl font-semibold mb-2">Connect with players</h3>
              <p>Chat with friends and gather a new squad to play.</p>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}