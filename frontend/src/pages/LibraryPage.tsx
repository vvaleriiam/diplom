import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { StatusSelect } from "../components/StatusSelect";
import { useLibrary, useLibraryMutations, useMyReviews } from "../hooks/usePlayd";
import { LibraryStatus } from "../types";

const tabs: Array<LibraryStatus | "all"> = ["all", "playing", "finished", "abandoned"];

const tabLabels: Record<string, string> = {
  all: "All",
  playing: "Playing",
  finished: "Finished",
  abandoned: "Abandoned",
};

const statusConfig = {
  playing: { dot: "bg-cyan-400", text: "text-cyan-300", pulse: true, label: "Playing" },
  finished: { dot: "bg-violet", text: "text-violet", pulse: false, label: "Finished" },
  abandoned: { dot: "bg-red-400", text: "text-red-300", pulse: false, label: "Abandoned" },
};

export function LibraryPage() {
  const [status, setStatus] = useState<LibraryStatus | "all">("all");
  const library = useLibrary(status);
  const mutations = useLibraryMutations();
  const reviews = useMyReviews();

  const reviewsByGame = useMemo(
    () => new Map((reviews.data || []).map((r) => [r.gameId, r])),
    [reviews.data],
  );

  const count = library.data?.length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/25">Collection</p>
          <h1 className="text-5xl font-black leading-none tracking-tight">My Library</h1>
        </div>
        {count > 0 && (
          <span className="select-none text-7xl font-black leading-none tabular-nums text-white/[0.05]">
            {count}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 flex border-b border-white/[0.07]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatus(tab)}
            className={`relative px-4 pb-3 pt-0 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors
              ${status === tab ? "text-white" : "text-white/30 hover:text-white/55"}`}
          >
            {tabLabels[tab]}
            {status === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-violet-400" />
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {!library.data?.length && !library.isLoading ? (
        <EmptyState title="Library is empty" body="Add games from the catalog to track your progress." />
      ) : null}

      {/* Entries */}
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {library.data
          ?.slice()
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((entry, index) => {
            const review = reviewsByGame.get(entry.gameId);
            const cfg = statusConfig[entry.status];

            return (
              <article key={entry.id} className="group flex gap-5 py-5">
                {/* Index number */}
                <span className="hidden w-7 flex-shrink-0 pt-1 text-right text-xs tabular-nums text-white/[0.12] sm:block">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Cover */}
                <Link to={`/games/${entry.gameId}`} className="flex-shrink-0">
                  <div className="relative h-[72px] w-32 overflow-hidden rounded-lg bg-panel2">
                    <img
                      src={entry.game.image || ""}
                      alt={entry.game.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    <div className={`absolute inset-y-0 left-0 w-[3px] ${cfg.dot}`} />
                  </div>
                </Link>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Status label */}
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/games/${entry.gameId}`}
                        className="block truncate text-[15px] font-bold leading-snug transition-colors hover:text-violet-300"
                      >
                        {entry.game.title}
                      </Link>

                      {/* Genres */}
                      {entry.game.genres?.length > 0 && (
                        <p className="mt-0.5 text-xs text-white/30">
                          {entry.game.genres.map((g) => g.name).join(" · ")}
                        </p>
                      )}

                      {/* Review quote */}
                      {review?.body && (
                        <p className="mt-1.5 line-clamp-1 text-xs italic text-white/35">
                          "{review.body}"
                        </p>
                      )}
                    </div>

                    {/* Rating */}
                    {review && (
                      <div className="flex-shrink-0 text-right leading-none">
                        <span className="text-3xl font-black tabular-nums text-white">
                          {review.rating}
                        </span>
                        <span className="text-xs text-white/25"> /10</span>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="mt-3 flex items-center gap-2">
                    <StatusSelect
                      value={entry.status}
                      onChange={(next) => mutations.update.mutate({ id: entry.id, status: next })}
                    />
                    <button
                      onClick={() => mutations.remove.mutate(entry.id)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/30 transition-colors hover:border-red-400/40 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
}
