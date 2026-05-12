import { FormEvent, useEffect, useMemo, useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { useParams } from "react-router-dom";
import { StatusSelect } from "../components/StatusSelect";
import { useGame, useLibrary, useLibraryMutations, useReview, useSaveReview } from "../hooks/usePlayd";
import { LibraryStatus } from "../types";

function platformStyle(name: string) {
  const n = name.toLowerCase();
  if (n.includes("playstation") || n === "ps4" || n === "ps5")
    return "border border-blue-500/30 bg-blue-900/30 text-blue-300";
  if (n.includes("xbox"))
    return "border border-green-500/30 bg-green-900/30 text-green-300";
  if (n.includes("nintendo") || n.includes("switch"))
    return "border border-red-500/30 bg-red-900/30 text-red-300";
  return "border border-white/15 bg-white/8 text-white/55";
}


export function GameDetailPage() {
  const { id } = useParams();
  const game = useGame(id);
  const library = useLibrary("all");
  const libraryMutations = useLibraryMutations();
  const review = useReview(id);
  const saveReview = useSaveReview();

  const [rating, setRating] = useState(8);
  const [body, setBody] = useState("");

  const entry = useMemo(() => library.data?.find((item) => item.gameId === id), [library.data, id]);
  const canReview = entry?.status === "finished";
  const hasReview = Boolean(review.data);

  useEffect(() => {
    if (review.data) {
      setRating(review.data.rating);
      setBody(review.data.body || "");
    }
  }, [review.data]);

  function submitReview(event: FormEvent) {
    event.preventDefault();
    if (id) saveReview.mutate({ gameId: id, rating, body });
  }

  if (game.isLoading) return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="skeleton aspect-[2/3] rounded-2xl" />
      <div className="space-y-4 pt-2">
        <div className="skeleton h-10 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
      </div>
    </div>
  );
  if (!game.data) return null;

  // Portrait overrides for games where Steam CDN portrait isn't available (e.g. pre-orders)
  const PORTRAIT_OVERRIDES: Record<number, string> = {
    2483190: "https://gamerinside.ru/wp-content/uploads/2026/01/forza-horizon-6-game-cover-iqwy.jpg.webp",
  };

  const coverImage = game.data.steamAppId && PORTRAIT_OVERRIDES[game.data.steamAppId]
    ? PORTRAIT_OVERRIDES[game.data.steamAppId]
    : game.data.steamAppId
      ? `https://cdn.akamai.steamstatic.com/steam/apps/${game.data.steamAppId}/library_600x900.jpg`
      : game.data.image || "";

  const releaseYear = game.data.releaseDate
    ? new Date(game.data.releaseDate).getFullYear()
    : null;

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(game.data.title + " official trailer")}`;


  return (
    <div>
      {/* Full-viewport blurred background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <img
          src={coverImage}
          alt=""
          className="h-full w-full scale-110 object-cover"
          style={{ filter: "blur(80px)", opacity: 0.22 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Left — cover + trailer */}
        <div>
          <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-panel2 shadow-glow">
            <img
              src={coverImage}
              alt={game.data.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                if (game.data.image) (e.target as HTMLImageElement).src = game.data.image;
              }}
            />
          </div>
          <a
            href={trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-panel/60 py-2.5 text-sm text-white/55 backdrop-blur transition-colors hover:text-white"
          >
            <Play size={13} />
            Watch Trailer
          </a>
        </div>

        {/* Right — info + actions */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-black leading-tight lg:text-5xl">{game.data.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {releaseYear && <span className="text-sm text-white/35">{releaseYear}</span>}
              {game.data.genres?.map((g) => (
                <span key={g.id} className="rounded-full bg-violet/15 px-3 py-1 text-sm text-violet-200">
                  {g.name}
                </span>
              ))}
            </div>

            {game.data.platforms?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {game.data.platforms.map((p) => (
                  <span key={p.id} className={`rounded-md px-2.5 py-1 text-xs font-medium ${platformStyle(p.name)}`}>
                    {p.name}
                  </span>
                ))}
              </div>
            ) : null}

            {game.data.steamAppId && (
              <a
                href={`https://store.steampowered.com/app/${game.data.steamAppId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60"
              >
                <ExternalLink size={11} />
                View on Steam
              </a>
            )}
          </div>

          <p className="leading-7 text-white/65">
            {game.data.description || "No description available."}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Library */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-panel/80 backdrop-blur">
              <div className="border-b border-white/5 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">My Library</p>
              </div>

              {entry ? (
                <>
                  {/* Hero status */}
                  {entry.status === "playing" && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-transparent px-5 py-5">
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-10 select-none">▶</div>
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3 flex-shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
                        </span>
                        <div>
                          <p className="text-base font-black tracking-tight text-cyan-300">Currently Playing</p>
                          <p className="text-[11px] text-white/30">
                            Since {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {entry.status === "finished" && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-violet/15 to-transparent px-5 py-5">
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-10 select-none">✓</div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 flex-shrink-0 rounded-full bg-violet shadow-[0_0_8px_2px_rgba(139,92,246,0.5)]" />
                        <div>
                          <p className="text-base font-black tracking-tight text-violet-300">Finished</p>
                          <p className="text-[11px] text-white/30">
                            Added {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {entry.status === "abandoned" && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-transparent px-5 py-5">
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-10 select-none">✕</div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 flex-shrink-0 rounded-full bg-red-400" />
                        <div>
                          <p className="text-base font-black tracking-tight text-red-300">Abandoned</p>
                          <p className="text-[11px] text-white/30">
                            Added {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Finished on */}
                  {entry.status === "finished" && (
                    <div className="border-t border-white/5 px-4 py-3">
                      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-white/25">Finished on</label>
                      <input
                        type="date"
                        value={entry.finishedAt || ""}
                        onChange={(e) =>
                          libraryMutations.update.mutate({ id: entry.id, status: entry.status, finishedAt: e.target.value || null })
                        }
                        className="w-full rounded-lg border border-white/10 bg-panel2 px-3 py-2 text-sm text-white [color-scheme:dark]"
                      />
                    </div>
                  )}

                  {/* Controls */}
                  <div className="border-t border-white/5 px-4 py-3">
                    <StatusSelect
                      value={entry.status}
                      onChange={(status) => libraryMutations.update.mutate({ id: entry.id, status })}
                      onRemove={() => libraryMutations.remove.mutate(entry.id)}
                    />
                  </div>
                </>
              ) : (
                <div className="divide-y divide-white/5">
                  <button
                    onClick={() => libraryMutations.add.mutate({ gameId: game.data.id, status: "playing" })}
                    className="group flex w-full items-center gap-4 px-5 py-4 transition-colors hover:bg-cyan-400/5"
                  >
                    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-cyan-400/50 bg-cyan-400/20 group-hover:bg-cyan-400" />
                    </span>
                    <span className="text-sm font-semibold text-white/60 group-hover:text-cyan-300">Currently Playing</span>
                  </button>
                  <button
                    onClick={() => libraryMutations.add.mutate({ gameId: game.data.id, status: "finished" })}
                    className="group flex w-full items-center gap-4 px-5 py-4 transition-colors hover:bg-violet/5"
                  >
                    <span className="flex h-2.5 w-2.5 flex-shrink-0 rounded-full border border-violet/50 bg-violet/20 group-hover:bg-violet" />
                    <span className="text-sm font-semibold text-white/60 group-hover:text-violet-300">Finished</span>
                  </button>
                  <button
                    onClick={() => libraryMutations.add.mutate({ gameId: game.data.id, status: "abandoned" })}
                    className="group flex w-full items-center gap-4 px-5 py-4 transition-colors hover:bg-red-400/5"
                  >
                    <span className="flex h-2.5 w-2.5 flex-shrink-0 rounded-full border border-red-400/50 bg-red-400/20 group-hover:bg-red-400" />
                    <span className="text-sm font-semibold text-white/60 group-hover:text-red-300">Abandoned</span>
                  </button>
                </div>
              )}
            </div>

            {/* Review */}
            <div className="rounded-xl border border-white/10 bg-panel/80 p-4 backdrop-blur">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">My Review</p>
              {!canReview ? (
                <p className="text-sm text-white/40">
                  Mark as <span className="text-violet-300">Finished</span> to leave a review.
                </p>
              ) : hasReview ? (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-violet-300">{review.data!.rating}</span>
                    <span className="text-sm text-white/35">/10</span>
                  </div>
                  {review.data!.body && (
                    <p className="mt-2 text-sm leading-6 italic text-white/55">"{review.data!.body}"</p>
                  )}
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className={`h-8 w-8 rounded-md text-xs font-bold transition-colors ${
                          rating === n ? "bg-violet text-white" : "bg-panel2 text-white/50 hover:bg-violet/20"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Your thoughts (optional)"
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-panel2 px-3 py-2 text-sm"
                  />
                  <button disabled={saveReview.isPending} className="rounded-lg bg-violet px-4 py-2 text-sm font-bold disabled:opacity-50">
                    Save
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
