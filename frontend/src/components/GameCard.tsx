import { Bookmark, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Game, LibraryEntry, LibraryStatus } from "../types";
import { useWishlistStore } from "../store/wishlist";
import { StatusSelect } from "./StatusSelect";

export function GameCard({
  game,
  libraryEntry,
  onAdd,
  onUpdate,
  onRemove,
}: {
  game: Game;
  libraryEntry?: LibraryEntry;
  onAdd?: (status: LibraryStatus) => void;
  onUpdate?: (status: LibraryStatus) => void;
  onRemove?: () => void;
}) {
  const wishlist = useWishlistStore();
  const wishlisted = wishlist.has(game.id);

  return (
    <article className="flex w-56 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel">
      <Link to={`/games/${game.id}`} className="block">
        <div className="aspect-[460/215] bg-panel2">
          {game.image ? (
            <img src={game.image} alt={game.title} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="p-3">
          <h3 className="truncate text-sm font-bold">{game.title}</h3>
          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/50">
            {game.description || game.genres?.map((g) => g.name).join(", ") || "No description"}
          </p>
        </div>
      </Link>
      <div className="mt-auto px-3 pb-3">
        {libraryEntry ? (
          <StatusSelect value={libraryEntry.status} onChange={(s) => onUpdate?.(s)} onRemove={onRemove} />
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                onChange={(event) => {
                  if (event.target.value) onAdd?.(event.target.value as LibraryStatus);
                  event.currentTarget.value = "";
                }}
                defaultValue=""
                className="w-full appearance-none rounded-lg border border-white/10 bg-panel2 px-3 py-2 pr-8 text-sm text-white"
              >
                <option value="" disabled>Add game</option>
                <option value="playing">Playing</option>
                <option value="finished">Finished</option>
                <option value="abandoned">Abandoned</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40" />
            </div>
            <button
              onClick={() => wishlisted ? wishlist.remove(game.id) : wishlist.add(game)}
              title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex flex-shrink-0 items-center justify-center rounded-lg border px-2.5 transition-colors
                ${wishlisted
                  ? "border-violet/50 bg-violet/10 text-violet-300 hover:border-red-400/40 hover:text-red-300"
                  : "border-white/10 bg-panel2 text-white/35 hover:border-violet/40 hover:text-violet-300"
                }`}
            >
              <Bookmark size={14} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
