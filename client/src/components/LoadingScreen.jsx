import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import AmbientBackground from "./AmbientBackground";

const LoadingScreen = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel panel-highlight relative flex w-full max-w-md flex-col items-center gap-5 rounded-[32px] px-8 py-10 text-center"
      >
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/20 bg-slate-900/70">
          <div className="absolute inset-2 rounded-full bg-cyan-400/10 blur-xl" />
          <LoaderCircle className="relative h-10 w-10 animate-spin text-cyan-300" />
        </div>
        <div>
          <p className="font-display text-2xl text-white">Initializing Smart Home Cloud</p>
          <p className="mt-2 text-sm text-slate-300">
            Connecting the dashboard to your cloud-synced appliance states.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
