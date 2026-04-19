import { motion } from "framer-motion";
import DeviceCard from "./DeviceCard";

const RoomSection = ({ room, devices, deviceConfig, updatingKey, onToggle }) => {
  const availableDevices = room.devices.filter((deviceName) => Boolean(devices[deviceName]));

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel panel-highlight rounded-[32px] p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Room cluster</p>
          <h2 className="mt-3 font-display text-3xl text-white">{room.label}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{room.description}</p>
        </div>
        <div className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
          {availableDevices.length} active controls
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {availableDevices.map((deviceName) => (
          <DeviceCard
            key={`${room.id}-${deviceName}`}
            device={devices[deviceName]}
            config={deviceConfig[deviceName]}
            roomLabel={room.label}
            onToggle={() => onToggle(deviceName)}
            isUpdating={updatingKey === deviceName}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default RoomSection;
