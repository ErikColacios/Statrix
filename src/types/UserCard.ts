// Public info of a user, shown in the user hover card
export type UserCard = {
    user_id: string,
    user_name: string,
    user_bio: string | null,
    user_avatar: string | null,
    user_banner: string | null,
    user_location: string | null,
    user_creationdate: Date,
}
