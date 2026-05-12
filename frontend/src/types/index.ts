export type Role = "user" | "admin";
export type LibraryStatus = "playing" | "finished" | "abandoned";

export type UserProfile = {
  id: string;
  name: string;
  birthDate: string | null;
  avatarUrl: string | null;
  steamId: string | null;
};

export type User = {
  id: string;
  email: string;
  role: Role;
  profile?: UserProfile;
};

export type Genre = { id: string; name: string; igdbId?: number | null };
export type Platform = { id: string; name: string; igdbId?: number | null };

export type Game = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  igdbId: number | null;
  steamAppId: number | null;
  releaseDate: string | null;
  genres: Genre[];
  platforms: Platform[];
};

export type LibraryEntry = {
  id: string;
  gameId: string;
  status: LibraryStatus;
  source: string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  game: Game;
};

export type Review = {
  id: string;
  userId: string;
  gameId: string;
  rating: number;
  body: string | null;
  createdAt: string;
  game: Game;
};

export type Stats = {
  total: number;
  byStatus: Record<LibraryStatus, number>;
  favoriteGenres: { name: string; count: number }[];
  activity: { month: string; count: number }[];
};
