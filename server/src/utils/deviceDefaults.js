export const DEVICE_DEFAULTS = [
  {
    name: "light",
    label: "Smart Light Network",
    rooms: ["living-room", "bedroom"],
    status: "off",
    temperature: null,
    brightness: 100,
  },
  {
    name: "fan",
    label: "Ceiling Fan",
    rooms: ["living-room"],
    status: "off",
    temperature: null,
    brightness: null,
  },
  {
    name: "door",
    label: "Main Door",
    rooms: ["entrance"],
    status: "closed",
    temperature: null,
    brightness: null,
  },
  {
    name: "ac",
    label: "Air Conditioner",
    rooms: ["bedroom"],
    status: "off",
    temperature: 22,
    brightness: null,
  },
];

export const DEVICE_STATUS_RULES = {
  light: ["on", "off"],
  fan: ["on", "off"],
  door: ["open", "closed"],
  ac: ["on", "off"],
};

export const DEVICE_ACTIVE_STATES = {
  light: ["on"],
  fan: ["on"],
  door: ["open"],
  ac: ["on"],
};

export const ROOM_DEFINITIONS = [
  {
    id: "living-room",
    label: "Living Room",
    description: "Ambient lighting and airflow for the lounge.",
    devices: ["light", "fan"],
  },
  {
    id: "bedroom",
    label: "Bedroom",
    description: "Night cooling and shared lighting for the suite.",
    devices: ["ac", "light"],
  },
  {
    id: "entrance",
    label: "Entrance",
    description: "Secure access monitoring for your entryway.",
    devices: ["door"],
  },
];

export const SCENE_PRESETS = {
  "good-night": {
    label: "Good Night",
    actions: [
      { deviceName: "light", status: "off", brightness: 0 },
      { deviceName: "fan", status: "off" },
      { deviceName: "ac", status: "off", temperature: 22 },
      { deviceName: "door", status: "closed" },
    ],
  },
  "movie-mode": {
    label: "Movie Mode",
    actions: [
      { deviceName: "light", status: "on", brightness: 35 },
      { deviceName: "fan", status: "on" },
    ],
  },
  "all-on": {
    label: "All On",
    actions: [
      { deviceName: "light", status: "on", brightness: 100 },
      { deviceName: "fan", status: "on" },
      { deviceName: "door", status: "open" },
      { deviceName: "ac", status: "on", temperature: 22 },
    ],
  },
  "all-off": {
    label: "All Off",
    actions: [
      { deviceName: "light", status: "off", brightness: 0 },
      { deviceName: "fan", status: "off" },
      { deviceName: "door", status: "closed" },
      { deviceName: "ac", status: "off", temperature: 22 },
    ],
  },
};

export const DEVICE_DEFAULTS_BY_NAME = DEVICE_DEFAULTS.reduce((defaultsByName, device) => {
  defaultsByName[device.name] = device;
  return defaultsByName;
}, {});
