import { ChevronDown } from "lucide-react";
import { LibraryStatus } from "../types";

const labels: Record<LibraryStatus, string> = {
  playing: "Currently Playing",
  finished: "Finished",
  abandoned: "Abandoned",
};

export function StatusBadge({ status }: { status: LibraryStatus }) {
  const color = status === "playing" ? "text-cyan-300 border-cyan-300/40" : status === "finished" ? "text-violet-300 border-violet-300/40" : "text-red-300 border-red-300/40";
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>{labels[status]}</span>;
}

export function StatusSelect({
  value,
  onChange,
  onRemove,
}: {
  value: LibraryStatus;
  onChange: (status: LibraryStatus) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => {
          if (event.target.value === "__remove__") {
            onRemove?.();
          } else {
            onChange(event.target.value as LibraryStatus);
          }
        }}
        className="w-full appearance-none rounded-lg border border-white/10 bg-panel2 px-3 py-2 pr-8 text-sm text-white"
      >
        <option value="playing">Currently Playing</option>
        <option value="finished">Finished</option>
        <option value="abandoned">Abandoned</option>
        {onRemove && <option value="__remove__">Remove from library</option>}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40" />
    </div>
  );
}
