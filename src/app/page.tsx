"use client"
import React, { useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { EffectCoverflow } from "swiper/modules"
import List from "@/components/landing/List"
import ChatBox from "@/components/landing/ChatBox"
import Review from "@/components/landing/Review"
import Footer from "@/components/Footer"
import UserVideogameMiniCard from "@/components/landing/UserVideogameMiniCard"
import AppWindow from "@/components/landing/AppWindow"
import FlareButton from "@/components/landing/FlareButton"
import FaqItem from "@/components/landing/FaqItem"
import ProfileCardFake from "@/components/landing/ProfileCardFake"
import dummies from "@/util/dummies"

const covers = [
  "cover_elden_ring", "cover_baldurs_gate3", "cover_cyberpunk2077", "cover_hollow_knight_silksong", "cover_red_dead_redemption2",
  "cover_expedition33", "cover_death_stranding2", "cover_silent_hill2", "cover_monster_hunter_world", "cover_fallout_new_vegas",
  "cover_alien_isolation", "cover_subnautica", "cover_resident_evil5", "cover_dragon_quest3", "cover_outlast2",
  "cover_pokemon_emerald", "cover_ratchet_and_clank3", "cover_need_for_speed_mw", "cover_daxter", "cover_harry_potter3",
].map((name) => `/staticImages/gameCovers/${name}.jpg`)

const profilePoints = [
  { title: "Make it look like you.", text: "Upload your own avatar and banner, write a bio and link your Steam, X, Twitch and website." },
  { title: "Show what you love.", text: "Pin your five favourite games and feature the lists that best describe you." },
  { title: "Stats that build themselves.", text: "Games played, completed, most played and your latest review, updated every time you log a game." },
]

const libraryPoints = [
  { title: "One click from Steam.", text: "Sign in with Steam and your library lands in Statrix, hours played included. No spreadsheets, no copy-paste." },
  { title: "A status for every game.", text: "Playing, completed, on hold or dropped. Add a score and your hours, and your profile keeps the stats." },
  { title: "Every game on IGDB.", text: "Search any title, old or new, with covers, release dates and details pulled straight from IGDB." },
]

const listPoints = [
  { title: "Ranked or unranked.", text: "Keep a numbered top 10, or just a collection of games that belong together." },
  { title: "Drag to reorder.", text: "Grab a cover and drop it where it belongs. The order is saved as you go." },
  { title: "Made to be shared.", text: "Every list lives on your profile, ready for friends to browse." },
]

const roadmap = [
  { title: "Social feed", text: "Screenshots, opinions and gaming moments in a feed built for players.", image: "/staticImages/bg_subnautica.jpg" },
  { title: "More platforms", text: "Bring your library from PlayStation and Xbox, not only Steam.", image: "/staticImages/bg_monster_hunter.jpg" },
  { title: "Deeper customization", text: "Avatars, banners, widgets and more ways to make your profile yours.", image: "/staticImages/bg_rapture.jpg" },
  { title: "Mobile app", text: "Your gaming identity on iOS and Android.", image: "/staticImages/bg_resident_evil.jpg" },
]

const faqs = [
  { question: "What is Statrix?", answer: "A social game tracker. Log the games you play with a status, score and hours played, write reviews, build lists, add friends and chat with them, all from one profile." },
  { question: "Where does the game data come from?", answer: "Game information and covers come from IGDB, so you can find practically any game, from the newest releases to the classics." },
  { question: "Can I import my Steam library?", answer: "Yes. Connect your Steam account and Statrix imports your games along with the hours you have played them." },
  { question: "What is the difference between ranked and unranked lists?", answer: "Ranked lists keep an order that you set by dragging and dropping games. Unranked lists are simple collections where the order doesn't matter." },
  { question: "Can I talk to my friends on Statrix?", answer: "Yes. Add friends and chat with them in real time, right next to the games you are both playing." },
]

export default function Home() {
  const swiperRef = useRef<SwiperType | null>(null)

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, amount: 0.15 }
  }

  return (
    <main className="min-h-screen bg-void text-snow overflow-hidden">

      {/* HERO */}
      <section className="relative isolate px-6 pt-32 pb-24 md:pt-40 lg:pb-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url(/staticImages/background_hero.jpg)] bg-cover bg-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-void/30" />
          <div className="absolute inset-0 bg-[radial-gradient(48%_42%_at_50%_62%,rgba(34,197,94,0.16),transparent_72%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(36%_32%_at_22%_14%,rgba(163,230,53,0.10),transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-display font-semibold text-balance headline-sheen">
              <span className="block">Every game.</span>
              <span className="block">One profile.</span>
            </h1>

            <p className="mt-6 max-w-[480px] text-lg text-smoke text-pretty">
              Track what you play, rank it in lists, review it and talk about it with friends. Your whole gaming life, in one place.
            </p>

            <p className="mt-7 text-sm text-gray-400">
              <strong className="font-semibold text-snow">Import your Steam library</strong> in one click.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <FlareButton href="/signup">Get started →</FlareButton>
              <Link href="/browseGames" className="rounded-full border border-edge bg-white/[0.03] px-7 py-3 text-center font-medium text-snow transition hover:border-green-500/40 hover:bg-white/[0.06]">
                Browse games
              </Link>
            </div>

            <p className="mt-4 text-xs text-smoke">Game data powered by IGDB.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mt-16 md:mt-20">
            <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-16 -z-10 animate-glow-pulse bg-[radial-gradient(50%_50%_at_50%_50%,rgba(34,197,94,0.18),transparent_70%)] motion-reduce:animate-none" />
            <AppWindow />
          </motion.div>
        </div>
      </section>


      {/* PROFILE */}
      <section className="relative isolate px-6 pt-8 pb-16 md:pb-24">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-green-400">Profile</p>
          <h2 className="mt-4 max-w-[16ch] text-display-lg font-semibold text-balance">A profile that plays like you.</h2>
          <p className="mt-5 max-w-[56ch] text-lg text-smoke text-pretty">
            Your avatar, your banner, your favourite games and the lists you are proudest of. Every game you log turns into stats, so your profile grows while you play.
          </p>

          <ol className="mt-10 grid gap-6 border-t border-edge pt-8 md:grid-cols-3">
            {profilePoints.map((point, index) => (
              <li key={point.title}>
                <span className="text-sm text-green-400">0{index + 1}</span>
                <p className="mt-2 font-semibold">{point.title}</p>
                <p className="mt-1 text-smoke">{point.text}</p>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div {...fadeUp} className="relative mx-auto mt-14 max-w-6xl">
          <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-16 -z-10 bg-[radial-gradient(50%_50%_at_50%_40%,rgba(34,197,94,0.14),transparent_70%)]" />
          <div className="relative overflow-hidden rounded-2xl border border-edge shadow-[0_40px_120px_-30px_rgba(34,197,94,0.3)]">
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-void via-void/85 to-void/60" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-2 bg-gradient-to-b from-white/20 via-green-300/5 to-transparent mix-blend-screen" />
            <div className="relative p-3 sm:p-6">
              <ProfileCardFake profile={dummies.profile} />
            </div>
          </div>
        </motion.div>
      </section>


      {/* LIBRARY */}
      <section className="relative isolate bg-[linear-gradient(to_bottom,var(--color-void),var(--color-canvas)_24rem)] py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold text-green-400">Library</p>
          <h2 className="mt-4 max-w-[14ch] text-display-lg font-semibold text-balance">Bring your whole library.</h2>
          <p className="mt-5 max-w-[56ch] text-lg text-smoke text-pretty">
            Start from the games you already own. Statrix fills your profile in seconds, then keeps track of everything you play next.
          </p>

          <ol className="mt-10 grid gap-6 border-t border-edge pt-8 md:grid-cols-3">
            {libraryPoints.map((point, index) => (
              <li key={point.title}>
                <span className="text-sm text-green-400">0{index + 1}</span>
                <p className="mt-2 font-semibold">{point.title}</p>
                <p className="mt-1 text-smoke">{point.text}</p>
              </li>
            ))}
          </ol>
        </motion.div>

        <div className="mt-14 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          {[false, true].map((reverse) => (
            <div key={String(reverse)} className={`flex w-max gap-4 animate-marquee motion-reduce:animate-none ${reverse ? "[animation-direction:reverse]" : ""}`}>
              {[...covers, ...covers].map((cover, index) => (
                <img key={index} src={cover} alt="" className="h-48 w-36 shrink-0 rounded-xl border border-edge object-cover" />
              ))}
            </div>
          ))}
        </div>

        <p className="mt-8 px-6 text-center text-sm text-smoke">
          Imports from <span className="text-snow">Steam</span> today. PlayStation and Xbox are on the way.
        </p>
      </section>


      {/* LISTS */}
      <section className="relative isolate bg-canvas py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold text-green-400">Lists</p>
          <h2 className="mt-4 max-w-[14ch] text-display-md font-semibold text-balance">Drag. Drop. Rank.</h2>
          <p className="mt-5 max-w-[56ch] text-lg text-smoke text-pretty">
            Your best RPGs, the horror games that kept you up at night, the ones that made you who you are. Put them in a list and put them in order.
          </p>

          <ul className="mt-10 grid gap-6 border-t border-edge pt-8 md:grid-cols-3">
            {listPoints.map((point) => (
              <li key={point.title}>
                <p className="font-semibold">{point.title}</p>
                <p className="mt-1 text-smoke">{point.text}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fadeUp} className="relative mx-auto mt-14 max-w-7xl px-6">
          <div aria-hidden="true" className="absolute -inset-8 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(34,197,94,0.12),transparent_70%)]" />
          <div className="hidden sm:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
          <div className="hidden sm:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />

          <Swiper
            onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
            slidesPerView={1}
            initialSlide={1}
            breakpoints={{ 1100: { slidesPerView: 2 } }}
            effect="coverflow"
            centeredSlides
            loop={false}
            coverflowEffect={{ rotate: -15, stretch: 0, depth: 80, modifier: 1, slideShadows: false }}
            modules={[EffectCoverflow]}
            className="w-full">
            <button onClick={() => swiperRef.current?.slidePrev()} className=' md:w-1/4 h-full z-50 absolute left-0 top-0 p-2 hover:bg-black/20 transition'>
              <svg className="lg:hidden" fill="#ffffff" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 "></polygon> </g></svg>
            </button>

            <button onClick={() => swiperRef.current?.slideNext()} className='lg:w-1/4 h-full z-50 absolute right-0 top-0 p-2 hover:bg-black/20 transition'>
              <svg className="lg:hidden" fill="#ffffff" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="11,38.32 28.609,21 11,3.68 13.72,1 34,21.01 13.72,41 "></polygon> </g></svg>
            </button>

            <SwiperSlide className="sm:p-4">
              <List list={dummies.lists.list1} />
            </SwiperSlide>
            <SwiperSlide className="sm:p-4">
              <List list={dummies.lists.list2} />
            </SwiperSlide>
            <SwiperSlide className="sm:p-4">
              <List list={dummies.lists.list3} />
            </SwiperSlide>
            <SwiperSlide className="sm:p-4">
              <List list={dummies.lists.list4} />
            </SwiperSlide>
          </Swiper>
        </motion.div>
      </section>


      {/* COMMUNITY */}
      <section className="relative isolate bg-canvas py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl px-6">
          <h2 className="text-display-lg font-semibold text-balance">Where players<br />talk games.</h2>
          <p className="mt-5 max-w-[58ch] text-lg text-smoke text-pretty">
            See what other players think before you buy, say what you think after you finish, and keep the conversation going with your friends.
          </p>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-5 text-sm font-semibold text-green-400">Community reviews</p>
              {dummies.reviews?.slice(0, 3).map((review: any, index: number) => (
                <Review review={review} index={index} key={index} />
              ))}
            </div>
            <div>
              <p className="mb-5 text-sm font-semibold text-green-400">Real-time chat</p>
              <ChatBox messages={dummies.messages} />
            </div>
          </div>
        </motion.div>

        <div className="mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max gap-6 animate-marquee motion-reduce:animate-none">
            {[...dummies.userVideogames, ...dummies.userVideogames].map((uv: any, index: number) => (
              <UserVideogameMiniCard userVideogames={uv} key={index} />
            ))}
          </div>
        </div>
      </section>


      {/* ROADMAP */}
      <section className="relative isolate border-t border-edge bg-[linear-gradient(to_bottom,var(--color-canvas),var(--color-void)_24rem)] py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-[620px] text-center">
            <h2 className="text-display-md font-semibold text-balance">What's next.</h2>
            <p className="mt-5 text-smoke text-pretty">Statrix keeps growing. This is what we are building now.</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((item) => (
              <div key={item.title} className="group relative min-h-80 overflow-hidden rounded-2xl border border-edge bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10 transition group-hover:via-void/50" />
                <div className="relative flex h-full min-h-80 flex-col justify-end p-6">
                  <span className="w-fit rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">Soon</span>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-300">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* FAQ */}
      <section className="relative isolate border-t border-edge bg-canvas py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-display-md font-semibold text-balance">Possible Questions.</h2>
            <p className="mt-5 max-w-[40ch] text-smoke">Everything you need to know before creating your profile.</p>
          </div>
          <div className="border-t border-edge">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </motion.div>
      </section>


      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden border-t border-edge bg-void px-6 pt-24 pb-40 md:pt-32 md:pb-48">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_50%_45%,rgba(34,197,94,0.14),transparent_70%)]" />
        <motion.div {...fadeUp} className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <img src="/logos/st1_white.png" alt="" className="mb-8 h-14 w-14 object-contain" />
          <h2 className="text-display-lg font-semibold text-balance headline-sheen">Ready in two clicks.</h2>
          <p className="mt-5 max-w-[46ch] text-lg text-smoke">Create your profile, import your library and start sharing what you play.</p>
          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <FlareButton href="/signup">Create your profile →</FlareButton>
            <Link href="/login" className="rounded-full border border-edge bg-white/[0.03] px-7 py-3 font-medium text-snow transition hover:border-green-500/40 hover:bg-white/[0.06]">
              Log in
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
