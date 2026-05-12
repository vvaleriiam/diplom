import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { authApi, profileApi } from "../api/playd";
import { useMyReviews, useSteamImport } from "../hooks/usePlayd";
import { useAuthStore } from "../store/auth";

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const steamImport = useSteamImport();
  const reviews = useMyReviews();
  const [steamId, setSteamId] = useState("");
  const [form, setForm] = useState({
    name: user?.profile?.name || "",
    birthDate: user?.profile?.birthDate || "",
    avatarUrl: user?.profile?.avatarUrl || "",
  });

  useEffect(() => {
    authApi.me().then(setUser).catch(() => undefined);
  }, [setUser]);

  useEffect(() => {
    setForm({
      name: user?.profile?.name || "",
      birthDate: user?.profile?.birthDate || "",
      avatarUrl: user?.profile?.avatarUrl || "",
    });
  }, [user?.profile?.avatarUrl, user?.profile?.birthDate, user?.profile?.name]);

  const changed = useMemo(() => {
    return (
      form.name !== (user?.profile?.name || "") ||
      form.birthDate !== (user?.profile?.birthDate || "") ||
      form.avatarUrl !== (user?.profile?.avatarUrl || "")
    );
  }, [form, user]);

  async function save() {
    await profileApi.save({ ...form, birthDate: form.birthDate || null, avatarUrl: form.avatarUrl || null });
    const fresh = await authApi.me();
    setUser(fresh);
    toast.success("Profile saved");
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/25">Account</p>
        <h1 className="text-5xl font-black leading-none tracking-tight">Profile</h1>
      </div>

      {/* Profile info & edit */}
      <section className="overflow-hidden rounded-xl border border-white/10 bg-panel">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Info</p>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center gap-5">
            <img
              src={form.avatarUrl || "https://placehold.co/128x128/20202b/a78bfa?text=P"}
              alt=""
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div>
              <div className="text-lg font-bold leading-tight">{user?.profile?.name || "Player"}</div>
              <div className="mt-0.5 text-sm text-white/40">{user?.email}</div>
              <div className="mt-0.5 text-xs text-white/30">
                Steam: {user?.profile?.steamId || "not connected"}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Display name"
              className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-3 text-sm placeholder:text-white/30 focus:border-violet/40 focus:outline-none"
            />
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-3 text-sm [color-scheme:dark] focus:border-violet/40 focus:outline-none"
            />
            <input
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              placeholder="Avatar URL"
              className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-3 text-sm placeholder:text-white/30 focus:border-violet/40 focus:outline-none"
            />
            <div>
              <button
                disabled={!changed}
                onClick={save}
                className="rounded-lg bg-violet px-5 py-2.5 text-sm font-bold disabled:opacity-40"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-panel">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Reviews</p>
        </div>
        {reviews.data?.length === 0 ? (
          <p className="px-6 py-5 text-sm text-white/40">
            No reviews yet. Finish a game and share your thoughts on its page.
          </p>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {reviews.data?.map((review, index) => (
              <div key={review.id} className="group flex gap-5 px-6 py-5">
                <span className="hidden w-7 flex-shrink-0 pt-1 text-right text-xs tabular-nums text-white/[0.12] sm:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link to={`/games/${review.gameId}`} className="flex-shrink-0">
                  <div className="relative h-[56px] w-24 overflow-hidden rounded-lg bg-panel2">
                    <img
                      src={review.game.image || ""}
                      alt={review.game.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-violet" />
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/games/${review.gameId}`}
                        className="block truncate text-[15px] font-bold leading-snug transition-colors hover:text-violet-300"
                      >
                        {review.game.title}
                      </Link>
                      {review.body && (
                        <p className="mt-1 line-clamp-1 text-xs italic text-white/35">"{review.body}"</p>
                      )}
                      <p className="mt-1 text-[10px] text-white/25">
                        {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right leading-none">
                      <span className="text-3xl font-black tabular-nums text-white">{review.rating}</span>
                      <span className="text-xs text-white/25"> /10</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Steam import */}
      <section className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-panel">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Steam</p>
        </div>
        <div className="p-6">
          <p className="mb-4 text-sm text-white/50">
            Paste your Steam ID or profile URL to import your game library.
          </p>
          <div className="flex gap-3">
            <input
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              placeholder="Steam ID or profile URL"
              className="flex-1 rounded-lg border border-white/10 bg-panel2 px-4 py-3 text-sm placeholder:text-white/30 focus:border-violet/40 focus:outline-none"
            />
            <button
              onClick={() => steamImport.mutate(steamId)}
              disabled={!steamId || steamImport.isPending}
              className="rounded-lg bg-violet px-5 py-3 text-sm font-bold disabled:opacity-40"
            >
              Import
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
