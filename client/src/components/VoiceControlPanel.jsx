import { motion } from "framer-motion";
import { Mic, MicOff, Radio, Speech } from "lucide-react";

const VoiceControlPanel = ({
  isSupported,
  isListening,
  transcript,
  onStart,
  onStop,
  commands,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel panel-highlight rounded-[32px] p-6"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
            <Speech className="h-3.5 w-3.5" />
            Voice Control
          </div>
          <h2 className="mt-4 font-display text-2xl text-white">Run devices and scenes using natural speech</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use the browser Web Speech API to control appliances hands-free. Direct commands and
            multi-device scenes are interpreted instantly and synchronized through the live backend.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <button
            type="button"
            onClick={isListening ? onStop : onStart}
            disabled={!isSupported}
            className={`group relative inline-flex min-w-52 items-center justify-center gap-3 overflow-hidden rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 ${
              isSupported
                ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-[0_18px_40px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
                : "cursor-not-allowed bg-slate-800 text-slate-400"
            }`}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
            {isListening ? <MicOff className="relative h-5 w-5" /> : <Mic className="relative h-5 w-5" />}
            <span className="relative">
              {isSupported ? (isListening ? "Stop listening" : "Start voice control") : "Voice not supported"}
            </span>
          </button>
          <p className="text-sm text-slate-400">
            {isListening
              ? "Listening for a command..."
              : isSupported
                ? "Tap the button and speak a command clearly."
                : "Use Chrome or Edge for Web Speech API support."}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.85fr,1.15fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Radio className="h-4 w-4 text-cyan-300" />
            Live transcript
          </div>
          <div className="mt-4 min-h-24 rounded-2xl border border-dashed border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
            {transcript || "Your recognized speech will appear here once a command is captured."}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
          <p className="text-sm font-semibold text-slate-200">Supported voice commands</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {commands.map((command) => (
              <div
                key={command}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
              >
                {command}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default VoiceControlPanel;
