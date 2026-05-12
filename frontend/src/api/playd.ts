import { api } from "./client";
import { Game, LibraryEntry, LibraryStatus, Review, Stats, User } from "../types";

type AdminGamePayload = Partial<Omit<Game, "genres" | "platforms">> & {
  genres?: string[];
  platforms?: string[];
};

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>("/auth/register", payload).then((res) => res.data),
  login: (payload: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>("/auth/login", payload).then((res) => res.data),
  guest: () => api.post<{ token: string; user: User }>("/auth/guest").then((res) => res.data),
  me: () => api.get<User>("/users/me").then((res) => res.data),
};

export const gamesApi = {
  catalog: (q?: string) => api.get<Game[]>("/games", { params: { q } }).then((res) => res.data),
  search: (q: string) => api.post<Game[]>("/games/search", { q }).then((res) => res.data),
  detail: (id: string) => api.get<Game>(`/games/${id}`).then((res) => res.data),
};

export const libraryApi = {
  list: (status?: LibraryStatus | "all") =>
    api.get<LibraryEntry[]>("/library", { params: status && status !== "all" ? { status } : {} }).then((res) => res.data),
  add: (gameId: string, status: LibraryStatus, source = "manual") =>
    api.post<LibraryEntry>("/library", { gameId, status, source }).then((res) => res.data),
  update: (id: string, status: LibraryStatus, finishedAt?: string | null) =>
    api.patch<LibraryEntry>(`/library/${id}`, { status, ...(finishedAt !== undefined && { finishedAt }) }).then((res) => res.data),
  remove: (id: string) => api.delete(`/library/${id}`).then((res) => res.data),
};

export const reviewsApi = {
  mine: () => api.get<Review[]>("/reviews").then((res) => res.data),
  forGame: (gameId: string) => api.get<Review | null>(`/reviews/game/${gameId}`).then((res) => res.data),
  save: (payload: { gameId: string; rating: number; body?: string | null }) =>
    api.post<Review>("/reviews", payload).then((res) => res.data),
};

export const statsApi = {
  mine: () => api.get<Stats>("/stats").then((res) => res.data),
};

export const profileApi = {
  save: (payload: Partial<{ name: string; birthDate: string | null; avatarUrl: string | null }>) =>
    api.patch("/users/me/profile", payload).then((res) => res.data),
  steamImport: (steamIdOrUrl: string) => api.post("/steam/import", { steamIdOrUrl }).then((res) => res.data),
};

export const adminApi = {
  users: () => api.get<User[]>("/admin/users").then((res) => res.data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`).then((res) => res.data),
  reviews: () => api.get<Review[]>("/admin/reviews").then((res) => res.data),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`).then((res) => res.data),
  createGame: (payload: AdminGamePayload) => api.post<Game>("/admin/games", payload).then((res) => res.data),
  updateGame: (id: string, payload: AdminGamePayload) => api.patch<Game>(`/admin/games/${id}`, payload).then((res) => res.data),
  deleteGame: (id: string) => api.delete(`/admin/games/${id}`).then((res) => res.data),
};
