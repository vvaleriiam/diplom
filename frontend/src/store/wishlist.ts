import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Game } from "../types";

type WishlistState = {
  items: Game[];
  add: (game: Game) => void;
  remove: (gameId: string) => void;
  has: (gameId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (game) => set((s) => ({ items: s.items.some((g) => g.id === game.id) ? s.items : [...s.items, game] })),
      remove: (gameId) => set((s) => ({ items: s.items.filter((g) => g.id !== gameId) })),
      has: (gameId) => get().items.some((g) => g.id === gameId),
    }),
    { name: "playd-wishlist" },
  ),
);