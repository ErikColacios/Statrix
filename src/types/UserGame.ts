import { GameStatus } from "@/enums/GameStatus";

export type UserGame = {
  user_id: string | undefined,
  game_id: number,
  game_name: string,
  game_image_id: string,
  game_base_image: string,
  favourite: boolean
  score: number,
  hours_played: number | undefined,
  status: GameStatus | undefined,
  year_completed: string,
}
