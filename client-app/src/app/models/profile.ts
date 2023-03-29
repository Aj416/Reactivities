export interface Profile {
  userName: string;
  displayName: string;
  bio?: string;
  image?: string;
  followersCount: number;
  followingCount: number;
  following: boolean;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
