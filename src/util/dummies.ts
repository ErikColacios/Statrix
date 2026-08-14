  const userVideogames = [
    { userName: "DrStorm", action: "started playing", gameName: "Kingdom Hearts 3", avatarImage: "/avatarImages/sora.jpg" },
    { userName: "erik", action: "rated", gameName: "Doom The dark ages", avatarImage: "/avatarImages/arthur_morgan.jpg" },
    { userName: "Xaldin", action: "started playing", gameName: "Marvel's Spider-Man", avatarImage: "/avatarImages/geralt.jpg" },
    { userName: "MiaXX", action: "starred", gameName: "Persona 5 Royal", avatarImage: "/avatarImages/hornet.jpg" },
    { userName: "noah4", action: "rated", gameName: "Silent Hill 2 Remake", avatarImage: "/avatarImages/cloud.jpg" },
    { userName: "AegonEX", action: "finished", gameName: "The Last of Us Part II", avatarImage: "/avatarImages/kratos.jpg" },
    { userName: "roronoa", action: "dropped", gameName: "One Piece Odyssey", avatarImage: "/avatarImages/sonic.jpg" },
    { userName: "joeliin", action: "starred", gameName: "Forza Horizon 6", avatarImage: "/avatarImages/mario_luigi.jpg" },
    { userName: "E.V.A", action: "started playing", gameName: "Project Zomboid", avatarImage: "/avatarImages/solid_snake.jpg" },
    { userName: "synnister", action: "started playing", gameName: "Delta Force", avatarImage: "/avatarImages/geralt.jpg" },
    { userName: "DestroyerPro100", action: "rated", gameName: "Bioshock Infinite", avatarImage: "/avatarImages/big_daddy.jpg" },
    { userName: "ByHittroX", action: "started playing", gameName: "Dark Souls", avatarImage: "/avatarImages/lady_maria.jpg" },
  ]

  const list1 = {
    listName: "Pure cinema", listGames: 23, listCreationDate: "2026-06-24", covers: [{ gameBaseImage: "/staticImages/game_covers/cover_cyberpunk2077.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_need_for_speed_mw.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_hollow_knight_silksong.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_red_dead_redemption2.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_death_stranding2.jpg" }]
  }

  const list2 = {
    listName: "Horror", listGames: 16, listCreationDate: "2026-05-03", covers: [{ gameBaseImage: "/staticImages/game_covers/cover_resident_evil5.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_silent_hill2.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_alien_isolation.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_outlast2.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_subnautica.jpg" }]
  }

  const list3 = {
    listName: "Fav RPGs", listGames: 9, listCreationDate: "2026-06-12", covers: [{gameBaseImage: "/staticImages/game_covers/cover_dragon_quest3.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_monster_hunter_world.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_fallout_new_vegas.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_expedition33.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_baldurs_gate3.jpg" }]
  }

  const list4 = {
    listName: "Nostalgia", listGames: 9, listCreationDate: "2026-07-17", covers: [{gameBaseImage: "/staticImages/game_covers/cover_pokemon_emerald.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_daxter.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_casper_spirit_dimensions.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_harry_potter3.jpg" },
    { gameBaseImage: "/staticImages/game_covers/cover_ratchet_and_clank3.jpg" }]
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

  const lists = {list1, list2, list3, list4}
  
  export default {
  userVideogames,
  lists,
  reviews,
  messages
}   