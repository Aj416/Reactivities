export interface Profile {
  userName: string;
  displayName: string;
  bio?: string;
  image?: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
