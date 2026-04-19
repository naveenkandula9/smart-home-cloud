import { motion } from "framer-motion";
import { QUICK_SCENES } from "../utils/deviceConfig";

const ScenePanel = ({ onRunScene, busyScene }) => {
  return (
    <section className="glass-panel panel-highlight rounded-[24px] p-4 sm:rounded-[32px] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Quick scenes</p>
          <h2 className="mt-3 font-display text-xl text-white sm:text-2xl">One-tap modes for the whole home</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Trigger multi-device states for bedtime, movies, arrival, and all-home actions instantly.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_SCENES.map((scene) => {
          const Icon = scene.icon;
          const isBusy = busyScene === scene.key;

          return (
            <motion.button
              key={scene.key}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onRunScene(scene.key)}
              disabled={Boolean(busyScene)}
              className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${scene.gradient} p-[1px] text-left shadow-neon sm:rounded-[28px]`}
            >
              <div className="h-full rounded-[23px] bg-slate-950/70 p-4 sm:rounded-[27px] sm:p-5">
                <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-2 sm:p-3 text-white">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl text-white sm:text-2xl">{scene.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{scene.description}</p>
                <p className="mt-4 text-sm font-semibold text-cyan-200 sm:mt-5">
                  {isBusy ? "Running scene..." : "Activate scene"}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default ScenePanel;
