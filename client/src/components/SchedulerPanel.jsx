import { useMemo, useState } from "react";
import { CalendarClock, Trash2 } from "lucide-react";
import { DEVICE_CONFIG } from "../utils/deviceConfig";
import { formatScheduleTime, formatTimestamp } from "../utils/formatters";

const SchedulerPanel = ({ schedules, onCreateSchedule, onToggleSchedule, onDeleteSchedule, isBusy }) => {
  const [form, setForm] = useState({
    name: "",
    deviceName: "light",
    action: "on",
    time: "18:00",
    temperature: 22,
    brightness: 100,
  });

  const availableActions = useMemo(() => {
    if (form.deviceName === "door") {
      return ["open", "closed"];
    }

    return ["on", "off"];
  }, [form.deviceName]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
      ...(name === "deviceName"
        ? {
            action: value === "door" ? "open" : "on",
          }
        : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onCreateSchedule({
      ...form,
      temperature: Number(form.temperature),
      brightness: Number(form.brightness),
    });

    setForm((currentForm) => ({
      ...currentForm,
      name: "",
    }));
  };

  return (
    <section className="glass-panel panel-highlight rounded-[32px] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Automation scheduler</p>
        <h2 className="mt-3 font-display text-3xl text-white">Daily routine automation</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Create recurring schedules that the backend executes with `node-cron`, then watch the live
          dashboard update automatically when tasks run.
        </p>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm text-slate-300">Schedule name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Turn on light at sunset"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Device</span>
              <select
                name="deviceName"
                value={form.deviceName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
              >
                {Object.entries(DEVICE_CONFIG).map(([deviceName, config]) => (
                  <option key={deviceName} value={deviceName}>
                    {config.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Action</span>
              <select
                name="action"
                value={form.action}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
              >
                {availableActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Time</span>
              <input
                name="time"
                value={form.time}
                onChange={handleChange}
                type="time"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                {form.deviceName === "ac" ? "Temperature" : "Brightness"}
              </span>
              <input
                name={form.deviceName === "ac" ? "temperature" : "brightness"}
                value={form.deviceName === "ac" ? form.temperature : form.brightness}
                onChange={handleChange}
                type="number"
                min={form.deviceName === "ac" ? 16 : 0}
                max={form.deviceName === "ac" ? 30 : 100}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              isBusy
                ? "cursor-wait bg-white/[0.06] text-slate-400"
                : "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:scale-[1.01]"
            }`}
          >
            <CalendarClock className="h-4 w-4" />
            {isBusy ? "Saving..." : "Create schedule"}
          </button>
        </form>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
          <p className="text-sm font-semibold text-white">Scheduled automations</p>
          <div className="mt-4 space-y-3">
            {schedules.length ? (
              schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{schedule.name}</p>
                      <p className="mt-1 text-sm text-slate-300">
                        {schedule.deviceName} will switch to {schedule.action} at {formatScheduleTime(schedule.time)}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Last run: {schedule.lastRunAt ? formatTimestamp(schedule.lastRunAt) : "Not executed yet"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={(event) => onToggleSchedule(schedule.id, event.target.checked)}
                        />
                        Enabled
                      </label>
                      <button
                        type="button"
                        onClick={() => onDeleteSchedule(schedule.id)}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-slate-300 transition hover:text-rose-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">
                No schedules created yet. Add your first recurring automation to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchedulerPanel;
