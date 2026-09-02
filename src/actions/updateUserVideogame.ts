"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import getUserVideogame from "./getUserVideogame";
import { UserGame } from "@/types/UserGame";
import { GameStatus } from "@/enums/GameStatus";
import insertUserGameActivity from "./insertUserGameActivity";

export default async function updateUserVideogame(userGameUpdated:UserGame) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }

  // First we get the previous user game data to compare and see what has changed
  const previousUserGame: UserGame = await getUserVideogame(userGameUpdated.game_id);

  // Then we check all the changes and create an array of activity changes to insert into the user_game_activity table
  const activityChanges: Activity[] = manageActivityChanges(previousUserGame, userGameUpdated, userId);


  try {
    if (previousUserGame === undefined) {
      // If the user has no data with this game then we add it

      await pool.query(
        `INSERT INTO user_videogame (user_id, game_id, favourite, score, hours_played, year_completed, game_name, game_image_id, game_base_image, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          userId,
          userGameUpdated.game_id,
          userGameUpdated.favourite,
          userGameUpdated.score,
          userGameUpdated.hours_played,
          userGameUpdated.year_completed,
          userGameUpdated.game_name,
          userGameUpdated.game_image_id,
          userGameUpdated.game_base_image,
          userGameUpdated.status,
        ],
      );

      insertUserGameActivity(activityChanges)

      return { success: true, message: "Game info added successfully!" };

    } else {
      await pool.query(
        `UPDATE user_videogame SET status = $1, score = $2, hours_played= $3, year_completed = $4, favourite = $5
          WHERE user_id = $6 AND game_id = $7`,
        [userGameUpdated.status, userGameUpdated.score, userGameUpdated.hours_played, userGameUpdated.year_completed, userGameUpdated.favourite, userId, userGameUpdated.game_id ]
      );

      insertUserGameActivity(activityChanges)

      return { success: true, message: "Game info updated successfully!" };
    }

  } catch (error) {
    console.error("Error updating user videogame:", error);
    return { success: false, message: "There was an error saving the game info." };
  }
}


function manageActivityChanges(previousUserGame: UserGame, userGameUpdated: UserGame, userId: string) {
  const activityChanges: Activity[] = []

  if (previousUserGame?.favourite !== userGameUpdated?.favourite) {
    if (userGameUpdated?.favourite) {
        const favouriteChange: Activity = {
        userId: userId, gameId: userGameUpdated.game_id, activityId: 0, gameName: userGameUpdated.game_name, gameBaseImage: userGameUpdated.game_base_image,
        action: "starred",
        action_date: new Date(),
      }
      activityChanges.push(favouriteChange);
    }
  }

  if (previousUserGame?.score.toString() !== userGameUpdated?.score.toString()) {
    if (userGameUpdated?.score !== 0){
      const scoreChange: Activity = {
        userId: userId, gameId: userGameUpdated.game_id, activityId: 0, gameName: userGameUpdated.game_name, gameBaseImage: userGameUpdated.game_base_image,
        action: "rated " + userGameUpdated.score,
        action_date: new Date(),
      }
      activityChanges.push(scoreChange);
    }
  }

  if (previousUserGame?.status !== userGameUpdated?.status) {
    const statusChange: Activity = {
      userId: userId, gameId: userGameUpdated.game_id, activityId: 0, gameName: userGameUpdated.game_name, gameBaseImage: userGameUpdated.game_base_image,
      action: userGameUpdated.status === GameStatus.PLAYING ? "started playing" : userGameUpdated.status === GameStatus.COMPLETED ? "completed" : userGameUpdated.status === GameStatus.DROPPED ? "dropped" : "updated status",
      action_date: new Date(),
    }

    activityChanges.push(statusChange);
  }

  return activityChanges;
}