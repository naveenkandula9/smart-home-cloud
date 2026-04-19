import { useEffect, useState } from "react";
import { Activity, Clock3, ShieldCheck, WifiOff } from "lucide-react";
import { formatTimestamp, getRelativeSyncLabel } from "../utils/formatters";

const TopNavbar = ({ user, lastUpdated, realtimeState, activeCount, totalCount }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <header className="glass-panel panel-highlight rounded-[32px] p-5 sm:p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Welcome back</p>
          <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">{user?.name}'s Smart Home</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Real-time rooms, analytics, automation schedules, and voice-driven scenes now run from a
            single premium command surface.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              Current time
            </div>
            <p className="mt-3 font-display text-2xl text-white">
              {new Intl.DateTimeFormat("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              }).format(now)}
            </p>
            <p className="mt-1 text-xs text-slate-400">{formatTimestamp(now.toISOString())}</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              <Activity className="h-4 w-4 text-emerald-300" />
              Status summary
            </div>
            <p className="mt-3 font-display text-2xl text-white">{`${activeCount}/${totalCount}`}</p>
            <p className="mt-1 text-xs text-slate-400">Devices active across all rooms</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              {realtimeState === "live" ? (
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
              ) : (
                <WifiOff className="h-4 w-4 text-amber-300" />
              )}
              Realtime sync
            </div>
            <p className="mt-3 font-display text-2xl text-white">
              {realtimeState === "live" ? "Connected" : "Reconnecting"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {lastUpdated ? `Last update ${getRelativeSyncLabel(lastUpdated)}` : "Waiting for live events"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
