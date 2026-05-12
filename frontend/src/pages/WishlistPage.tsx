import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { useLibraryMutations } from "../hooks/usePlayd";
import { useWishlistStore } from "../store/wishlist";
import { LibraryStatus } from "../types";

export function WishlistPage() {
  const { items, remove } = useWishlistStore();
  const mutations = useLibraryMutations();

  function addToLibrary(gameId: string, status: LibraryStatus) {
    mutations.add.mutate({ gameId, status }, { onSuccess: () => remove(gameId) });
  }

  return (
    <div>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/25">Saved</p>
          <h1 className="text-5xl font-black leading-none tracking-tight">Wishlist</h1>
        </div>
        {items.length > 0 && (
          <span className="select-none text-7xl font-black leading-none tabular-nums text-white/[0.05]">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState title="Wishlist is empty" body="Bookmark games from the catalog to save them here." />
      ) : (
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {items.map((game, index) => (
            <article key={game.id} className="group flex gap-5 py-5">
              <span className="hidden w-7 flex-shrink-0 pt-1 text-right text-xs tabular-nums text-white/[0.12] sm:block">
                {String(index + 1).padStart(2, "0")}
              </span>

              <Link to={`/games/${game.id}`} className="flex-shrink-0">
                <div className="h-[72px] w-32 overflow-hidden rounded-lg bg-panel2">
                  <img
                    src={game.image || ""}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </div>
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  to={`/games/${game.id}`}
                  className="block truncate text-[15px] font-bold leading-snug transition-colors hover:text-violet-300"
                >
                  {game.title}
                </Link>
                {game.genres?.length > 0 && (
                  <p className="mt-0.5 text-xs text-white/30">
                    {game.genres.map((g) => g.name).join(" · ")}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) addToLibrary(game.id, e.target.value as LibraryStatus);
                      e.currentTarget.value = "";
                    }}
                    className="appearance-none rounded-lg border border-white/10 bg-panel2 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="" disabled>Add to library</option>
                    <option value="playing">Playing</option>
                    <option value="finished">Finished</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                  <button
                    onClick={() => remove(game.id)}
                    title="Remove from wishlist"
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/30 transition-colors hover:border-red-400/40 hover:text-red-300"
                  >
                    <Bookmark size={12} />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
