import { useEffect, useState } from "react";
import { Activity, Cloud, RefreshCw, Sparkles } from "lucide-react";
import { formatTimestamp, getRelativeSyncLabel } from "../utils/formatters";

const DashboardHeader = ({
  activeCount,
  totalCount,
  lastUpdated,
  isRefreshing,
  isConnected,
  onRefresh,
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const stats = [
    {
      label: "Cloud Sync",
      value: lastUpdated ? "Live" : "Pending",
      helper: lastUpdated ? `Last sync ${getRelativeSyncLabel(lastUpdated)}` : "Fetch starts on launch",
      icon: Cloud,
      accent: "from-cyan-400/20 to-sky-500/10 text-cyan-200",
    },
    {
      label: "Active Devices",
      value: `${activeCount}/${totalCount}`,
      helper: activeCount === 0 ? "System is idle" : "Automation states are persisted",
      icon: Activity,
      accent: "from-emerald-400/20 to-teal-500/10 text-emerald-200",
    },
    {
      label: "Current Time",
      value: new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }).format(now),
      helper: formatTimestamp(now.toISOString()),
      icon: Sparkles,
      accent: "from-amber-400/20 to-orange-500/10 text-amber-200",
    },
  ];

  return (
    <header className="space-y-6">
      <div className="glass-panel panel-highlight overflow-hidden rounded-[36px] p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              <Cloud className="h-3.5 w-3.5" />
              Smart Home Command Center
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Premium cloud dashboard for your simulated smart appliances
            </h1>
            <p className="mt-4 max-w-2xl text-balance text-base leading-7 text-slate-300 sm:text-lg">
              Control lights, climate, airflow, and entry access with animated interactions,
              voice commands, and MongoDB-backed state persistence.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-slate-200 shadow-neon">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Last cloud update</p>
              <p className="mt-2 font-display text-xl text-white">{formatTimestamp(lastUpdated)}</p>
              <p className="mt-1 text-slate-400">
                {lastUpdated ? getRelativeSyncLabel(lastUpdated) : "Waiting for first sync"}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                  isConnected
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                    : "border-amber-300/20 bg-amber-400/10 text-amber-200"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-300" : "bg-amber-300"}`} />
                {isConnected ? "Cloud connected" : "Cloud reconnecting"}
              </div>

              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  isRefreshing
                    ? "cursor-wait bg-white/[0.05] text-slate-400"
                    : "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:scale-[1.01]"
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing" : "Refresh state"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="glass-panel panel-highlight rounded-[28px] border border-white/10 p-5"
            >
              <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${stat.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-300">{stat.helper}</p>
            </div>
          );
        })}
      </div>
    </header>
  );
};

export default DashboardHeader;
