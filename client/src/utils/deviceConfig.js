import {
  Activity,
  AirVent,
  BellRing,
  CalendarClock,
  DoorOpen,
  Fan,
  Film,
  Lightbulb,
  LayoutDashboard,
  MoonStar,
  Power,
  Radio,
} from "lucide-react";

export const DEVICE_CONFIG = {
  light: {
    title: "Smart Light",
    kicker: "Lighting",
    description: "Shared ambient lighting with adjustable brightness for mood scenes.",
    icon: Lightbulb,
    variant: "light",
    glowClass: "bg-amber-300/40 opacity-100",
    activeStates: ["on"],
    statusLabels: {
      on: "Bright",
      off: "Dark",
    },
    actionLabels: {
      on: "Turn on light",
      off: "Turn off light",
    },
    nextStatus: {
      active: "off",
      inactive: "on",
    },
  },
  fan: {
    title: "Smart Fan",
    kicker: "Airflow",
    description: "Ventilation tuned for comfort with instant real-time sync.",
    icon: Fan,
    variant: "fan",
    glowClass: "bg-cyan-300/30 opacity-100",
    activeStates: ["on"],
    statusLabels: {
      on: "Spinning",
      off: "Standby",
    },
    actionLabels: {
      on: "Turn on fan",
      off: "Turn off fan",
    },
    nextStatus: {
      active: "off",
      inactive: "on",
    },
  },
  door: {
    title: "Smart Door",
    kicker: "Access",
    description: "Entry access control with security-first automation presets.",
    icon: DoorOpen,
    variant: "door",
    glowClass: "bg-emerald-300/30 opacity-100",
    activeStates: ["open"],
    statusLabels: {
      open: "Open",
      closed: "Secured",
    },
    actionLabels: {
      on: "Open door",
      off: "Close door",
    },
    nextStatus: {
      active: "closed",
      inactive: "open",
    },
  },
  ac: {
    title: "Smart AC",
    kicker: "Climate",
    description: "Bedroom climate control with temperature-aware scheduling.",
    icon: AirVent,
    variant: "ac",
    glowClass: "bg-sky-300/35 opacity-100",
    activeStates: ["on"],
    statusLabels: {
      on: "Cooling",
      off: "Idle",
    },
    actionLabels: {
      on: "Turn on AC",
      off: "Turn off AC",
    },
    nextStatus: {
      active: "off",
      inactive: "on",
    },
  },
};

export const ROOM_FALLBACKS = [
  {
    id: "living-room",
    label: "Living Room",
    description: "Ambient lighting and airflow for shared moments.",
    devices: ["light", "fan"],
  },
  {
    id: "bedroom",
    label: "Bedroom",
    description: "Night comfort with climate and lighting together.",
    devices: ["ac", "light"],
  },
  {
    id: "entrance",
    label: "Entrance",
    description: "Secure, responsive access at the front door.",
    devices: ["door"],
  },
];

export const SUPPORTED_COMMANDS = [
  "turn on light",
  "turn off light",
  "turn on fan",
  "turn off fan",
  "open door",
  "close door",
  "turn on ac",
  "turn off ac",
  "good night",
  "movie mode",
  "all on",
  "all off",
];

export const VOICE_SCENE_MAP = {
  "good night": "good-night",
  "movie mode": "movie-mode",
  "all on": "all-on",
  "all off": "all-off",
};

export const QUICK_SCENES = [
  {
    key: "good-night",
    label: "Good Night",
    description: "Power down the home and secure the entrance.",
    icon: MoonStar,
    gradient: "from-indigo-400/30 to-slate-200/10",
  },
  {
    key: "movie-mode",
    label: "Movie Mode",
    description: "Dim the lights and keep air flowing for a calm watch session.",
    icon: Film,
    gradient: "from-amber-300/30 to-rose-300/10",
  },
  {
    key: "all-on",
    label: "All On",
    description: "Wake every appliance and open the home state instantly.",
    icon: Power,
    gradient: "from-emerald-300/30 to-cyan-300/10",
  },
  {
    key: "all-off",
    label: "All Off",
    description: "Return every device to a secure low-power state.",
    icon: BellRing,
    gradient: "from-slate-200/20 to-slate-400/10",
  },
];

export const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "rooms", label: "Rooms", icon: Radio },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "automation", label: "Automation", icon: CalendarClock },
];
