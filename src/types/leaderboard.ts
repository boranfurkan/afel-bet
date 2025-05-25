export interface LeaderboardUser {
  rank: number;
  username: string;
  posts: number;
  points: number;
  profile_image_url: string;
}

export interface LeaderboardResponse {
  leaderboard: {
    ordered_users: {
      twitter_id: string;
      profile_image_url: string;
      username: string;
      displayName: string;
      points: number;
      posts: number;
      _id: string;
    }[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo: null | any;
}
