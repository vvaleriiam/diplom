import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "../components/EmptyState";
import { useStats } from "../hooks/usePlayd";

export function StatsPage() {
  const stats = useStats();
  const data = stats.data;

  if (!data?.total && !stats.isLoading) {
    return <EmptyState title="No statistics yet" body="Add games to your library to see status, genre, and activity charts." />;
  }

  return (
    <div>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/25">Overview</p>
          <h1 className="text-5xl font-black leading-none tracking-tight">Statistics</h1>
        </div>
        {data?.total ? (
          <span className="select-none text-7xl font-black leading-none tabular-nums text-white/[0.05]">
            {data.total}
          </span>
        ) : null}
      </div>

      <div className="mt-0 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Total" value={data?.total || 0} />
        <StatCard label="Playing" value={data?.byStatus.playing || 0} accent="text-cyan-300" />
        <StatCard label="Finished" value={data?.byStatus.finished || 0} accent="text-violet" />
        <StatCard label="Abandoned" value={data?.byStatus.abandoned || 0} accent="text-red-300" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-panel p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Genres</p>
          <h2 className="mb-5 text-base font-bold">Favorite genres</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.favoriteGenres || []}>
              <CartesianGrid stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff30" tick={{ fontSize: 11 }} />
              <YAxis stroke="#ffffff30" tick={{ fontSize: 11 }} width={24} />
              <Tooltip
                contentStyle={{ background: "#171720", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-white/10 bg-panel p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Activity</p>
          <h2 className="mb-5 text-base font-bold">Games added per month</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data?.activity || []}>
              <CartesianGrid stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="month" stroke="#ffffff30" tick={{ fontSize: 11 }} />
              <YAxis stroke="#ffffff30" tick={{ fontSize: 11 }} width={24} />
              <Tooltip
                contentStyle={{ background: "#171720", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                cursor={{ stroke: "rgba(255,255,255,0.06)" }}
              />
              <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = "text-white" }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-panel p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">{label}</p>
      <div className={`mt-2 text-4xl font-black tabular-nums leading-none ${accent}`}>{value}</div>
    </div>
  );
}
