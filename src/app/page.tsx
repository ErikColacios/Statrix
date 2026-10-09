"use client"
import React, { useRef } from "react"
import Link from "next/link"
import List from "@/components/List"
import Review from "@/components/Review"
import ChatBox from "@/components/ChatBox"
import Footer from "@/components/Footer"
import dummies from "@/util/dummies"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { EffectCoverflow } from "swiper/modules"
import UserVideogameMiniCard from "@/components/UserVideogameMiniCard"

export default function Home() {
  const swiperRef = useRef<SwiperType | null>(null)

  const fadeUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    viewport: { once: true, amount: 0.2 }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-green-500/10 blur-[140px] rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-lime-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
            Your gaming
            <span className="block bg-clip-text text-transparent bg-linear-to-r from-green-400 via-lime-400 to-green-500 pb-2">
              identity.
            </span>
          </h1>

          <p className="max-w-2xl mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed">
            Track the games you play, build your lists, share your opinions and connect with people who love the same games you do.
          </p>

          <div className="flex sm:flex-row gap-4 mt-10">
            <Link href="/signup" className="px-5 py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-400 hover:to-lime-400 font-semibold transition-all shadow-lg shadow-green-500/10">
              Start now
            </Link>
            <Link href="/browseGames" className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/30 transition-all">
              Browse games
            </Link>
          </div>
        </div>

        {/* Game cards marquee */}
        <div className="relative z-10 w-full max-w-6xl mt-20 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-6 w-max marquee-track-x [animation:marquee-x_35s_linear_infinite]">
            {dummies.userVideogames?.map((uv: any, index: number) => (
              <UserVideogameMiniCard userVideogames={uv} key={index} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>


      {/* GAMING IDENTITY */}
      <motion.section {...fadeUp} className="max-w-6xl mx-auto px-6 py-28 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-green-400 text-sm uppercase tracking-[0.25em] font-semibold mb-4">
              Your profile
            </p>

            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              Your games tell
              <span className="block text-gray-500">your story.</span>
            </h2>

            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Every game you play says something about you. Keep your gaming history, favourites, reviews and progress together in one place.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="border border-white/10 bg-white/[0.03] rounded-xl p-4">
                <p className="text-2xl font-bold">Games</p>
                <p className="text-sm text-gray-500 mt-1">Track everything you play</p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] rounded-xl p-4">
                <p className="text-2xl font-bold">Reviews</p>
                <p className="text-sm text-gray-500 mt-1">Share your opinions</p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] rounded-xl p-4">
                <p className="text-2xl font-bold">Lists</p>
                <p className="text-sm text-gray-500 mt-1">Organize your library</p>
              </div>
              <div className="border border-white/10 bg-white/[0.03] rounded-xl p-4">
                <p className="text-2xl font-bold">Friends</p>
                <p className="text-sm text-gray-500 mt-1">Find your people</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-green-500/10 blur-3xl rounded-full" />
            <img src="/staticImages/statrix_profile.jpg" alt="Statrix profile" className="relative w-full rounded-2xl border border-white/10 shadow-2xl" />
          </div>
        </div>
      </motion.section>


      {/* LIBRARY */} 
      <motion.section {...fadeUp} className="py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-green-400 text-sm uppercase tracking-[0.25em] font-semibold mb-4">
              Your library
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold">
              Build your own
              <span className="block text-gray-500">gaming library.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Create lists, rate games and keep track of your progress however you want.
            </p>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="hidden sm:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <Swiper
              onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
              slidesPerView={1}
              initialSlide={1}
              breakpoints={{ 1100: { slidesPerView: 2 } }}
              effect="coverflow"
              centeredSlides
              loop={false}
              coverflowEffect={{ rotate: -15, stretch: 0, depth: 80, modifier: 1, slideShadows: true }}
              modules={[EffectCoverflow]}
              className="w-full">
              <button onClick={() => swiperRef.current?.slidePrev()} className='md:w-1/4 h-full z-50 absolute left-0 top-0 p-2 hover:bg-black/20 transition'>
                <svg className="lg:hidden" fill="#ffffff" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 "></polygon> </g></svg>
              </button>

              <button onClick={() => swiperRef.current?.slideNext()} className='lg:w-1/4 h-full z-50 absolute right-0 top-0 p-2 hover:bg-black/20 transition'>
                <svg className="lg:hidden" fill="#ffffff" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="11,38.32 28.609,21 11,3.68 13.72,1 34,21.01 13.72,41 "></polygon> </g></svg>
              </button>

              <SwiperSlide className="p-4">
                <List list={dummies.lists.list1} />
              </SwiperSlide>
              <SwiperSlide className="p-4">
                <List list={dummies.lists.list2} />
              </SwiperSlide>
              <SwiperSlide className="p-4">
                <List list={dummies.lists.list3} />
              </SwiperSlide>
              <SwiperSlide className="p-4">
                <List list={dummies.lists.list4} />
              </SwiperSlide>
            </Swiper>

          </div>
        </div>
      </motion.section>


      {/* COMMUNITY */}
      <motion.section {...fadeUp} className="max-w-6xl mx-auto px-6 py-28 lg:py-40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-green-400 text-sm uppercase tracking-[0.25em] font-semibold mb-4">
            Community
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Find people who
            <span className="block text-gray-500">play like you.</span>
          </h2>
          <p className="mt-5 text-lg text-gray-400">
            Discover what other players think, share your own opinions and start conversations around the games you love.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-sm text-green-400">COMMUNITY REVIEWS</p>
                <h3 className="text-2xl font-semibold mt-1">What players think</h3>
              </div>
              <span className="text-gray-600">01 — 03</span>
            </div>

            <div className="space-y-4">
              {dummies.reviews?.map((review: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}>
                  <Review review={review} index={index} />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5">
              <p className="text-sm text-green-400">PRIVATE & GROUP CHAT</p>
              <h3 className="text-2xl font-semibold mt-1">Talk about your games</h3>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}>
              <ChatBox messages={dummies.messages} />
            </motion.div>
          </div>

        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section {...fadeUp} className="py-28 lg:py-36">

        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-green-400 text-sm uppercase tracking-[0.25em] font-semibold mb-4">
              Statrix
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold">
              Everything you need
              <span className="block text-gray-500">to showcase your games.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="group relative overflow-hidden rounded-2xl min-h-[420px] bg-[url('/staticImages/bg_subnautica.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative h-full min-h-[420px] flex flex-col justify-end p-7">
                <p className="text-green-400 text-sm font-semibold uppercase tracking-wider">Coming soon</p>
                <h3 className="text-3xl font-bold mt-2">Social feed</h3>
                <p className="text-gray-300 mt-3 max-w-lg">
                  Share screenshots, opinions and gaming moments with a feed designed specifically for players.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl min-h-[420px] bg-[url('/staticImages/bg_monster_hunter.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative h-full min-h-[420px] flex flex-col justify-end p-7">
                <p className="text-green-400 text-sm font-semibold uppercase tracking-wider">Coming soon</p>
                <h3 className="text-3xl font-bold mt-2">Multiplatform imports</h3>
                <p className="text-gray-300 mt-3 max-w-lg">
                  Bring your library from platforms like Steam, PlayStation and Xbox into your Statrix profile.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl min-h-[420px] bg-[url('/staticImages/bg_rapture.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative h-full min-h-[420px] flex flex-col justify-end p-7">
                <p className="text-green-400 text-sm font-semibold uppercase tracking-wider">Coming soon</p>
                <h3 className="text-3xl font-bold mt-2">Enhanced customization</h3>
                <p className="text-gray-300 mt-3 max-w-lg">
                  Personalize your profile with avatars, banners, widgets and more ways to make it yours.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl min-h-[420px] bg-[url('/staticImages/bg_resident_evil.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative h-full min-h-[420px] flex flex-col justify-end p-7">
                <p className="text-green-400 text-sm font-semibold uppercase tracking-wider">Coming soon</p>
                <h3 className="text-3xl font-bold mt-2">Mobile app</h3>
                <p className="text-gray-300 mt-3 max-w-lg">
                  Take your gaming identity with you wherever you go on iOS and Android.
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section {...fadeUp} className="relative py-32 lg:py-44 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_55%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">

          <p className="text-green-400 text-sm uppercase tracking-[0.25em] font-semibold mb-5">
            Start your journey
          </p>

          <h2 className="text-5xl sm:text-7xl font-bold leading-tight">
            Your games.
            <span className="block text-gray-500">Your identity.</span>
          </h2>

          <p className="max-w-xl mx-auto mt-7 text-lg text-gray-400">
            Create your Statrix profile, discover new games and start building your gaming identity today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link href="/signup" className="px-8 py-4 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-400 hover:to-lime-400 font-semibold transition-all shadow-lg shadow-green-500/10">
              Create your profile
            </Link>
            <Link href="/browseGames" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Browse games
            </Link>
          </div>

          <img src="/logos/st2_white.png" alt="Statrix" className="w-48 sm:w-64 mx-auto mt-20 opacity-40" />
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}