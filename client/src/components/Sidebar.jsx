import { motion } from "framer-motion";
import { Home, LogOut } from "lucide-react";
import { NAV_ITEMS } from "../utils/deviceConfig";

const Sidebar = ({ user, onLogout }) => {
  const handleNavClick = (sectionId) => {
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel panel-highlight sticky top-6 hidden h-[calc(100vh-3rem)] min-w-72 flex-col justify-between rounded-[32px] p-6 lg:flex"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Smart Home</p>
              <p className="font-display text-2xl text-white">Version 2</p>
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Operator</p>
            <p className="mt-3 text-lg font-semibold text-white">{user?.name}</p>
            <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
          </div>

          <nav className="mt-10 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-400/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </motion.aside>

      <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
