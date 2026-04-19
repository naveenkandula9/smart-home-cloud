import { motion } from "framer-motion";
import DeviceCard from "./DeviceCard";

const RoomSection = ({ room, devices, deviceConfig, updatingKey, onToggle }) => {
  const availableDevices = room.devices.filter((deviceName) => Boolean(devices[deviceName]));

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel panel-highlight rounded-[24px] p-4 sm:rounded-[32px] sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Room cluster</p>
          <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">{room.label}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{room.description}</p>
        </div>
        <div className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 sm:px-4 sm:py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
          {availableDevices.length} active controls
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2">
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
