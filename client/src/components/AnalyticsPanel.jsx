import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = ["#38bdf8", "#475569"];

const chartPanelClass = "rounded-[28px] border border-white/10 bg-slate-950/45 p-5";

const AnalyticsPanel = ({ statusData, devicePowerData }) => {
  return (
    <section className="glass-panel panel-highlight rounded-[24px] p-4 sm:rounded-[32px] sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Analytics</p>
        <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">Live device status</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Track how many devices are active right now and which appliances are currently ON or OFF across
          the home.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:gap-5 xl:grid-cols-2">
        <div className={chartPanelClass}>
          <p className="text-sm font-semibold text-white">Active vs inactive devices</p>
          <div className="mt-4 h-48 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={96}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(9, 16, 29, 0.96)",
                    border: "1px solid rgba(148,163,184,0.16)",
                    borderRadius: 16,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={chartPanelClass}>
          <p className="text-sm font-semibold text-white">Devices ON/OFF</p>
          <div className="mt-4 h-48 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={devicePowerData}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} domain={[0, 1]} ticks={[0, 1]} />
                <Tooltip
                  formatter={(value, _name, payload) => [payload?.payload?.status || value, "State"]}
                  contentStyle={{
                    background: "rgba(9, 16, 29, 0.96)",
                    border: "1px solid rgba(148,163,184,0.16)",
                    borderRadius: 16,
                  }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {devicePowerData.map((entry) => (
                    <Cell key={entry.name} fill={entry.value ? "#34d399" : "#64748b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPanel;
