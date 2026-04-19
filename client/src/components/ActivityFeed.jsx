import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { formatTimestamp, getRelativeSyncLabel } from "../utils/formatters";
import { exportReport } from "../services/api";

const ActivityFeed = ({ activities }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      const result = await exportReport();

      // Show success toast with file link
      toast.success(
        <div>
          <p>Report exported successfully!</p>
          <a
            href={result.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Download CSV Report
          </a>
        </div>,
        { duration: 10000 }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to export report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="glass-panel panel-highlight rounded-[24px] p-4 sm:rounded-[32px] sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Alerts and activity</p>
          <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">Live operational feed</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Device changes, scene activations, and scheduled automations appear here in real time so you
            can monitor the home at a glance.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportReport}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2 sm:px-5 sm:py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export Report to AWS"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {activities.length ? (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 sm:px-5 sm:py-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{activity.message}</p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>{getRelativeSyncLabel(activity.createdAt)}</p>
                  <p className="mt-1">{formatTimestamp(activity.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
            Activity alerts will populate here as soon as devices, scenes, or schedules start firing.
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityFeed;
