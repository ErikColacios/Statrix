type FeedActivity = Activity & {
  user_avatar: string | null;
}

type FeedCursor = {
  action_date: Date;
  activity_id: number;
}
