import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { adminApi } from "../api/playd";
import { useAdminData } from "../hooks/usePlayd";
import { Game } from "../types";

export function AdminPage() {
  const queryClient = useQueryClient();
  const { users, reviews, games } = useAdminData();
  const [editing, setEditing] = useState<Game | null>(null);
  const [gameForm, setGameForm] = useState({
    title: "",
    description: "",
    image: "",
    releaseDate: "",
    genres: "",
    platforms: "",
  });

  async function remove(kind: "user" | "review" | "game", id: string) {
    if (kind === "user") await adminApi.deleteUser(id);
    if (kind === "review") await adminApi.deleteReview(id);
    if (kind === "game") await adminApi.deleteGame(id);
    toast.success("Deleted");
    queryClient.invalidateQueries();
  }

  async function saveGame() {
    const payload = {
      title: gameForm.title,
      description: gameForm.description || null,
      image: gameForm.image || null,
      releaseDate: gameForm.releaseDate || null,
      genres: gameForm.genres.split(",").map((item) => item.trim()).filter(Boolean),
      platforms: gameForm.platforms.split(",").map((item) => item.trim()).filter(Boolean),
    };
    if (editing) await adminApi.updateGame(editing.id, payload);
    else await adminApi.createGame(payload);
    toast.success(editing ? "Game updated" : "Game created");
    setEditing(null);
    setGameForm({ title: "", description: "", image: "", releaseDate: "", genres: "", platforms: "" });
    queryClient.invalidateQueries({ queryKey: ["admin-games"] });
  }

  function startEdit(game: Game) {
    setEditing(game);
    setGameForm({
      title: game.title,
      description: game.description || "",
      image: game.image || "",
      releaseDate: game.releaseDate || "",
      genres: game.genres?.map((genre) => genre.name).join(", ") || "",
      platforms: game.platforms?.map((platform) => platform.name).join(", ") || "",
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Admin Panel</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Users">
          {users.data?.map((user) => (
            <Row key={user.id} title={user.email} meta={user.profile?.name || user.role} onDelete={() => remove("user", user.id)} />
          ))}
        </Panel>
        <Panel title="Reviews">
          {reviews.data?.map((review) => (
            <Row key={review.id} title={`${review.game?.title || "Game"} - ${review.rating}/10`} meta={review.body || "No body"} onDelete={() => remove("review", review.id)} />
          ))}
        </Panel>
        <Panel title="Games">
          <div className="space-y-2 rounded-lg bg-panel2 p-3">
            <input value={gameForm.title} onChange={(event) => setGameForm({ ...gameForm, title: event.target.value })} placeholder="Title" className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm" />
            <input value={gameForm.image} onChange={(event) => setGameForm({ ...gameForm, image: event.target.value })} placeholder="Image URL" className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm" />
            <input type="date" value={gameForm.releaseDate} onChange={(event) => setGameForm({ ...gameForm, releaseDate: event.target.value })} className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm" />
            <input value={gameForm.genres} onChange={(event) => setGameForm({ ...gameForm, genres: event.target.value })} placeholder="Genres, comma-separated" className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm" />
            <input value={gameForm.platforms} onChange={(event) => setGameForm({ ...gameForm, platforms: event.target.value })} placeholder="Platforms, comma-separated" className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm" />
            <textarea value={gameForm.description} onChange={(event) => setGameForm({ ...gameForm, description: event.target.value })} placeholder="Description" className="min-h-20 w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm" />
            <button disabled={!gameForm.title} onClick={saveGame} className="rounded-md bg-violet px-3 py-2 text-sm font-bold disabled:opacity-50">
              {editing ? "Update game" : "Add game"}
            </button>
          </div>
          {games.data?.map((game) => (
            <Row key={game.id} title={game.title} meta={game.releaseDate || "No date"} onEdit={() => startEdit(game)} onDelete={() => remove("game", game.id)} />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-panel p-5">
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ title, meta, onDelete, onEdit }: { title: string; meta: string; onDelete: () => void; onEdit?: () => void }) {
  return (
    <div className="rounded-lg bg-panel2 p-3">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 line-clamp-2 text-sm text-white/50">{meta}</div>
      <div className="mt-3 flex gap-2">
        {onEdit ? <button onClick={onEdit} className="rounded-md border border-violet/50 px-3 py-1 text-sm text-violet-100">Edit</button> : null}
        <button onClick={onDelete} className="rounded-md border border-red-400/40 px-3 py-1 text-sm text-red-200">Delete</button>
      </div>
    </div>
  );
}
