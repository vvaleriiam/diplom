import { useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "../components/GameCard";
import { SkeletonGrid } from "../components/SkeletonGrid";
import { EmptyState } from "../components/EmptyState";
import { useCatalog, useLibrary, useLibraryMutations } from "../hooks/usePlayd";
import { useAuthStore } from "../store/auth";
import { Game } from "../types";

const GENRE_SECTIONS = [
  { title: "Action Games", tags: ["action", "fps", "shooter", "souls-like", "hack and slash", "roguelite", "platformer"] },
  { title: "RPG & Adventure", tags: ["rpg", "action rpg", "jrpg", "open world", "adventure", "metroidvania"] },
  { title: "Indie & Puzzle", tags: ["indie", "puzzle", "exploration", "detective", "simulation", "turn-based", "co-op"] },
  { title: "Racing & Driving", tags: ["racing", "sports", "sport", "driving", "simulator"] },
];

function matchesSection(game: Game, tags: string[]) {
  return game.genres?.some((g) => tags.includes(g.name.toLowerCase()));
}

function GameRow({ title, games, libraryByGame, onAdd, onUpdate, onRemove }: {
  title?: string;
  games: Game[];
  libraryByGame: Map<string, any>;
  onAdd: (gameId: string, status: any) => void;
  onUpdate: (entryId: string, status: any) => void;
  onRemove: (entryId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (n: number) => ref.current?.scrollBy({ left: n, behavior: "smooth" });

  return (
    <div>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll(-300)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-panel2 text-white/40 transition-colors hover:border-white/25 hover:text-white"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => scroll(300)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-panel2 text-white/40 transition-colors hover:border-white/25 hover:text-white"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
      <div ref={ref} className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            libraryEntry={libraryByGame.get(game.id)}
            onAdd={(status) => onAdd(game.id, status)}
            onUpdate={(status) => {
              const entry = libraryByGame.get(game.id);
              if (entry) onUpdate(entry.id, status);
            }}
            onRemove={() => {
              const entry = libraryByGame.get(game.id);
              if (entry) onRemove(entry.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function CatalogPage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const catalog = useCatalog(query);
  const library = useLibrary("all");
  const mutations = useLibraryMutations();

  const libraryByGame = useMemo(
    () => new Map((library.data || []).map((entry) => [entry.gameId, entry])),
    [library.data],
  );

  const sections = useMemo(() => {
    if (!catalog.data) return [];
    const named = GENRE_SECTIONS.map((s) => ({
      title: s.title,
      games: catalog.data!.filter((g) => matchesSection(g, s.tags)),
    })).filter((s) => s.games.length > 0);

    const categorized = new Set(named.flatMap((s) => s.games.map((g) => g.id)));
    const rest = catalog.data!.filter((g) => !categorized.has(g.id));
    if (rest.length > 0) named.push({ title: "Other Games", games: rest });

    return named;
  }, [catalog.data]);

  const greeting = user?.profile?.name || user?.email?.split("@")[0] || "User";

  return (
    <div>
      {!query && (
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/25">Discover</p>
          <h1 className="text-5xl font-black leading-none tracking-tight">Hello, {greeting}!</h1>
          <p className="mt-3 max-w-lg text-sm text-white/50">
            Search for any title or browse the sections below.
          </p>
        </div>
      )}

      {catalog.isLoading && !catalog.data ? <SkeletonGrid /> : null}

      {query ? (
        <section>
          <h2 className="mb-4 text-lg font-bold tracking-tight">
            Search results
            {catalog.isFetching ? <span className="ml-3 text-sm font-normal text-white/40">Searching…</span> : null}
          </h2>
          {!catalog.isLoading && !catalog.data?.length ? (
            <EmptyState
              title="No games found"
              body="Try another title. IGDB credentials can expand results beyond the local catalog."
            />
          ) : (
            <GameRow
              games={catalog.data ?? []}
              libraryByGame={libraryByGame}
              onAdd={(gameId, status) => mutations.add.mutate({ gameId, status })}
              onUpdate={(id, status) => mutations.update.mutate({ id, status })}
              onRemove={(id) => mutations.remove.mutate(id)}
            />
          )}
        </section>
      ) : (
        sections.map((section) => (
          <section key={section.title} className="mb-10">
            <GameRow
              title={section.title}
              games={section.games}
              libraryByGame={libraryByGame}
              onAdd={(gameId, status) => mutations.add.mutate({ gameId, status })}
              onUpdate={(id, status) => mutations.update.mutate({ id, status })}
              onRemove={(id) => mutations.remove.mutate(id)}
            />
          </section>
        ))
      )}
    </div>
  );
}
