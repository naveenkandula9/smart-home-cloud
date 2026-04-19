import Device from "../models/Device.js";
import {
  DEVICE_ACTIVE_STATES,
  DEVICE_DEFAULTS,
  DEVICE_DEFAULTS_BY_NAME,
  DEVICE_STATUS_RULES,
  ROOM_DEFINITIONS,
  SCENE_PRESETS,
} from "../utils/deviceDefaults.js";
import { createActivity } from "./activityService.js";
import { emitSocketEvent } from "./socketService.js";

const formatDevice = (device) => ({
  id: device._id,
  name: device.name,
  label: device.label,
  rooms: device.rooms,
  status: device.status,
  temperature: device.temperature,
  brightness: device.brightness,
  updatedAt: device.updatedAt,
  createdAt: device.createdAt,
});

const toDeviceMap = (devices) =>
  devices.reduce((accumulator, device) => {
    accumulator[device.name] = formatDevice(device);
    return accumulator;
  }, {});

const getLatestUpdate = (devices) => {
  const timestamps = devices
    .map((device) => new Date(device.updatedAt).getTime())
    .filter(Number.isFinite);

  if (!timestamps.length) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
};

const getInsertDefaults = (deviceName) => {
  const defaults = DEVICE_DEFAULTS_BY_NAME[deviceName];

  if (!defaults) {
    const error = new Error("Device not found.");
    error.statusCode = 404;
    throw error;
  }

  return defaults;
};

const buildUpdatePayload = ({ deviceName, status, temperature, brightness }) => {
  const defaults = getInsertDefaults(deviceName);
  const allowedStatuses = DEVICE_STATUS_RULES[deviceName];

  if (!status || !allowedStatuses.includes(status)) {
    const error = new Error(
      `Invalid status for ${deviceName}. Allowed values: ${allowedStatuses.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const updatePayload = {
    name: defaults.name,
    label: defaults.label,
    rooms: defaults.rooms,
    status,
    updatedAt: new Date(),
    temperature: defaults.temperature,
    brightness: defaults.brightness,
  };

  if (deviceName === "ac") {
    const nextTemperature = status === "on" ? Number(temperature ?? defaults.temperature ?? 22) : 22;

    if (!Number.isFinite(nextTemperature) || nextTemperature < 16 || nextTemperature > 30) {
      const error = new Error("AC temperature must be a number between 16 and 30.");
      error.statusCode = 400;
      throw error;
    }

    updatePayload.temperature = nextTemperature;
  }

  if (deviceName === "light") {
    const nextBrightness = status === "on" ? Number(brightness ?? defaults.brightness ?? 100) : 0;

    if (!Number.isFinite(nextBrightness) || nextBrightness < 0 || nextBrightness > 100) {
      const error = new Error("Light brightness must be a number between 0 and 100.");
      error.statusCode = 400;
      throw error;
    }

    updatePayload.brightness = nextBrightness;
  }

  if (deviceName !== "ac") {
    updatePayload.temperature = null;
  }

  if (deviceName !== "light") {
    updatePayload.brightness = null;
  }

  return updatePayload;
};

export const seedDefaultDevices = async () => {
  const existingCount = await Device.countDocuments();

  if (existingCount === 0) {
    await Device.insertMany(DEVICE_DEFAULTS);
    return;
  }

  for (const device of DEVICE_DEFAULTS) {
    await Device.updateOne(
      { name: device.name },
      {
        $setOnInsert: device,
      },
      {
        upsert: true,
      }
    );
  }
};

export const getDevicesSnapshot = async () => {
  const devices = await Device.find().sort({ name: 1 }).lean();

  return {
    devices: toDeviceMap(devices),
    lastUpdated: getLatestUpdate(devices),
    rooms: ROOM_DEFINITIONS,
  };
};

export const applyDeviceUpdate = async ({
  deviceName,
  status,
  temperature,
  brightness,
  actor,
  source = "manual",
  emit = true,
  logActivity = true,
}) => {
  const updatePayload = buildUpdatePayload({
    deviceName,
    status,
    temperature,
    brightness,
  });

  const updatedDevice = await Device.findOneAndUpdate(
    { name: deviceName },
    {
      $set: updatePayload,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  ).lean();

  const snapshot = await getDevicesSnapshot();

  let activity = null;

  if (logActivity) {
    activity = await createActivity(
      {
        type: source === "schedule" ? "schedule" : "device",
        title: `${updatedDevice.label} ${updatedDevice.status}`,
        message: `${updatedDevice.label} switched to ${updatedDevice.status}.`,
        deviceName: updatedDevice.name,
        status: updatedDevice.status,
        source,
        actorName: actor?.name || "System",
        metadata: {
          temperature: updatedDevice.temperature,
          brightness: updatedDevice.brightness,
          active: DEVICE_ACTIVE_STATES[updatedDevice.name]?.includes(updatedDevice.status) || false,
        },
      },
      { emit }
    );
  }

  if (emit) {
    emitSocketEvent("devices:updated", {
      device: formatDevice(updatedDevice),
      devices: snapshot.devices,
      lastUpdated: snapshot.lastUpdated,
      source,
    });
  }

  return {
    device: formatDevice(updatedDevice),
    snapshot,
    activity,
  };
};

export const applyScene = async (sceneName, actor) => {
  const scene = SCENE_PRESETS[sceneName];

  if (!scene) {
    const error = new Error("Scene not found.");
    error.statusCode = 404;
    throw error;
  }

  for (const action of scene.actions) {
    await applyDeviceUpdate({
      ...action,
      actor,
      source: "scene",
      emit: false,
      logActivity: false,
    });
  }

  const snapshot = await getDevicesSnapshot();
  const activity = await createActivity({
    type: "scene",
    title: scene.label,
    message: `${scene.label} executed successfully.`,
    source: "scene",
    actorName: actor?.name || "System",
    metadata: {
      sceneName,
      actions: scene.actions,
    },
  });

  emitSocketEvent("devices:updated", {
    devices: snapshot.devices,
    lastUpdated: snapshot.lastUpdated,
    source: "scene",
    scene: {
      key: sceneName,
      label: scene.label,
    },
  });

  return {
    scene: {
      key: sceneName,
      label: scene.label,
    },
    snapshot,
    activity,
  };
};
