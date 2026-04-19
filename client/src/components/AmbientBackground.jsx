import { motion } from "framer-motion";

const orbTransition = {
  duration: 8,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

const AmbientBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade bg-[size:56px_56px] opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_75%_15%,rgba(251,191,36,0.08),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.12),transparent_25%)]" />

      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={orbTransition}
        className="absolute left-[-10rem] top-[-7rem] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1.04, 1, 1.06] }}
        transition={{ ...orbTransition, duration: 9 }}
        className="absolute right-[-7rem] top-24 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, 18, 0], scale: [1, 1.1, 1] }}
        transition={{ ...orbTransition, duration: 10 }}
        className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
      />
    </div>
  );
};

export default AmbientBackground;
