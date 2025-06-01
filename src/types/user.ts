export interface User {
  id: string;
  username: string;
  wallet?: string;
  twitter_data: {
    username: string;
    profile_image_url: string;
    displayName: string;
  };
  // add other user properties as needed
}
