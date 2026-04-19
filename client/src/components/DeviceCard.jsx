import { motion } from "framer-motion";
import { LoaderCircle, Sparkles } from "lucide-react";
import { formatTimestamp, getRelativeSyncLabel } from "../utils/formatters";

const cardTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const DeviceVisual = ({ variant, Icon, isActive, statusLabel, temperature }) => {
  if (variant === "light") {
    return (
      <div className="relative flex h-32 items-center justify-center">
        <motion.div
          animate={{
            scale: isActive ? 1.06 : 1,
            opacity: isActive ? 1 : 0.65,
          }}
          transition={cardTransition}
          className={`absolute h-24 w-24 rounded-full blur-2xl ${
            isActive ? "bg-amber-300/45" : "bg-slate-600/20"
          }`}
        />
        <motion.div
          animate={{ y: isActive ? [0, -5, 0] : 0 }}
          transition={{ duration: 2.6, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
          className={`relative rounded-[28px] border p-5 ${
            isActive
              ? "border-amber-200/30 bg-amber-300/10 text-amber-200"
              : "border-white/10 bg-slate-900/60 text-slate-400"
          }`}
        >
          <Icon className="h-10 w-10" />
        </motion.div>
      </div>
    );
  }

  if (variant === "fan") {
    return (
      <div className="flex h-32 items-center justify-center">
        <motion.div
          animate={{ rotate: isActive ? 360 : 0 }}
          transition={{
            duration: isActive ? 1.4 : 0.4,
            repeat: isActive ? Infinity : 0,
            ease: isActive ? "linear" : "easeOut",
          }}
          className={`rounded-full border p-5 ${
            isActive
              ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-200"
              : "border-white/10 bg-slate-900/60 text-slate-400"
          }`}
        >
          <Icon className="h-12 w-12" />
        </motion.div>
      </div>
    );
  }

  if (variant === "door") {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="relative h-28 w-24 rounded-[22px] border border-white/10 bg-slate-900/50 p-2">
          <motion.div
            animate={{
              rotateZ: isActive ? -18 : 0,
              x: isActive ? -8 : 0,
              scaleY: isActive ? 0.99 : 1,
            }}
            transition={cardTransition}
            style={{ transformOrigin: "left center" }}
            className={`relative h-full w-full rounded-[18px] border ${
              isActive
                ? "border-emerald-300/30 bg-gradient-to-br from-emerald-400/25 to-emerald-200/5"
                : "border-white/10 bg-gradient-to-br from-slate-700/80 to-slate-900"
            }`}
          >
            <div className="absolute right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-slate-200/80" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-32 items-center justify-center">
      <motion.div
        animate={{
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.15,
          scale: isActive ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute h-24 w-24 rounded-full blur-2xl ${
          isActive ? "bg-sky-300/35" : "bg-slate-700/25"
        }`}
      />
      <div
        className={`relative flex flex-col items-center gap-2 rounded-[28px] border px-5 py-4 ${
          isActive
            ? "border-sky-200/25 bg-sky-400/10 text-sky-100"
            : "border-white/10 bg-slate-900/60 text-slate-400"
        }`}
      >
        <Icon className="h-10 w-10" />
        <span className="text-sm font-semibold">
          {isActive ? `${temperature}\u00B0C` : statusLabel}
        </span>
      </div>
    </div>
  );
};

const DeviceCard = ({ device, config, onToggle, isUpdating, roomLabel }) => {
  const Icon = config.icon;
  const isActive = config.activeStates.includes(device.status);
  const actionLabel = isActive ? config.actionLabels.off : config.actionLabels.on;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={cardTransition}
      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/40 p-[1px] shadow-neon"
    >
      <div className="ring-glow group-hover:opacity-100" />
      <div className="panel-highlight relative rounded-[31px] p-5">
        <div
          className={`absolute inset-x-6 top-0 h-24 rounded-full blur-3xl transition-opacity duration-500 ${
            isActive ? config.glowClass : "opacity-30"
          }`}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              {config.kicker}
            </div>
            {roomLabel ? (
              <div className="mt-3 inline-flex rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                {roomLabel}
              </div>
            ) : null}
            <h3 className="mt-4 font-display text-2xl text-white">{config.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{config.description}</p>
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
              isActive
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                : "border-white/10 bg-white/[0.04] text-slate-400"
            }`}
          >
            {config.statusLabels[device.status] || device.status}
          </div>
        </div>

        <DeviceVisual
          variant={config.variant}
          Icon={Icon}
          isActive={isActive}
          statusLabel={config.statusLabels[device.status]}
          temperature={device.temperature}
        />

        <div className="relative mt-4 grid gap-3 rounded-[24px] border border-white/10 bg-slate-900/50 p-4 text-sm">
          <div className="flex items-center justify-between text-slate-300">
            <span>Current state</span>
            <span className="font-semibold text-white">{config.statusLabels[device.status] || device.status}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Last updated</span>
            <span className="font-medium text-white">{getRelativeSyncLabel(device.updatedAt)}</span>
          </div>
          {config.variant === "ac" ? (
            <div className="flex items-center justify-between text-slate-300">
              <span>Temperature</span>
              <span className="font-medium text-white">{`${device.temperature ?? 22}\u00B0C`}</span>
            </div>
          ) : null}
          {config.variant === "light" ? (
            <div className="flex items-center justify-between text-slate-300">
              <span>Brightness</span>
              <span className="font-medium text-white">{`${device.brightness ?? 0}%`}</span>
            </div>
          ) : null}
          <p className="text-xs text-slate-400">{formatTimestamp(device.updatedAt)}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={isUpdating}
          className={`relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ${
            isActive
              ? "bg-white/[0.06] text-white hover:bg-white/[0.1]"
              : "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:scale-[1.01]"
          } ${isUpdating ? "cursor-wait opacity-70" : ""}`}
        >
          {isUpdating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isUpdating ? "Syncing..." : actionLabel}
        </button>
      </div>
    </motion.article>
  );
};

export default DeviceCard;
