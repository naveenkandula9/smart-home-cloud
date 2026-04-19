import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const AuthCard = ({
  title,
  description,
  submitLabel,
  footerLabel,
  footerLinkLabel,
  footerLinkTo,
  values,
  loading,
  error,
  showNameField,
  onChange,
  onSubmit,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel panel-highlight relative z-10 w-full max-w-md overflow-hidden rounded-[36px] p-8 shadow-ambient"
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_70%)]" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
          Smart Home Cloud V2
        </div>
        <h1 className="mt-5 font-display text-4xl text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {showNameField ? (
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Full name</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                <UserRound className="h-4 w-4 text-slate-400" />
                <input
                  name="name"
                  value={values.name}
                  onChange={onChange}
                  placeholder="Naveen Kandula"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  autoComplete="name"
                />
              </div>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                name="email"
                value={values.email}
                onChange={onChange}
                placeholder="you@example.com"
                type="email"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
              <LockKeyhole className="h-4 w-4 text-slate-400" />
              <input
                name="password"
                value={values.password}
                onChange={onChange}
                placeholder="Minimum 6 characters"
                type="password"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                autoComplete={showNameField ? "new-password" : "current-password"}
              />
            </div>
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              loading
                ? "cursor-wait bg-white/[0.06] text-slate-400"
                : "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:scale-[1.01]"
            }`}
          >
            {loading ? "Please wait..." : submitLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          {footerLabel}{" "}
          <Link to={footerLinkTo} className="font-semibold text-cyan-200 hover:text-white">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </motion.section>
  );
};

export default AuthCard;
