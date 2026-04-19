import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Download,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import AmbientBackground from "../components/AmbientBackground";
import AnalyticsPanel from "../components/AnalyticsPanel";
import ActivityFeed from "../components/ActivityFeed";
import LoadingScreen from "../components/LoadingScreen";
import RoomSection from "../components/RoomSection";
import ScenePanel from "../components/ScenePanel";
import SchedulerPanel from "../components/SchedulerPanel";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import VoiceControlPanel from "../components/VoiceControlPanel";
import { useAuth } from "../context/AuthContext";
import { useVoiceControl } from "../hooks/useVoiceControl";
import {
  createSchedule,
  executeScene,
  exportReport,
  fetchActivities,
  fetchDevices,
  fetchSchedules,
  removeSchedule,
  saveDeviceState,
  updateSchedule,
} from "../services/api";
import { createDashboardSocket } from "../services/socket";
import {
  DEVICE_CONFIG,
  ROOM_FALLBACKS,
  SUPPORTED_COMMANDS,
  VOICE_SCENE_MAP,
} from "../utils/deviceConfig";

const normalizeCommand = (value) =>
  value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const DashboardPage = () => {
  const { logout, token, user } = useAuth();
  const [devices, setDevices] = useState({});
  const [rooms, setRooms] = useState(ROOM_FALLBACKS);
  const [activities, setActivities] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [realtimeState, setRealtimeState] = useState("connecting");
  const [updatingKey, setUpdatingKey] = useState("");
  const [busyScene, setBusyScene] = useState("");
  const [scheduleBusy, setScheduleBusy] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const ignoredActivityIdsRef = useRef(new Set());

  const syncDashboard = async ({ showLoader = false, successMessage = "" } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const [deviceData, activityData, scheduleData] = await Promise.all([
        fetchDevices(),
        fetchActivities(),
        fetchSchedules(),
      ]);

      setDevices(deviceData.devices);
      setRooms(deviceData.rooms || ROOM_FALLBACKS);
      setLastUpdated(deviceData.lastUpdated);
      setActivities(activityData.activities);
      setSchedules(scheduleData.schedules);
      setError("");

      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Unable to load the V2 dashboard right now.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncDashboard({ showLoader: true });
  }, []);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const socket = createDashboardSocket(token);

    socket.on("connect", () => {
      setRealtimeState("live");
      syncDashboard();
    });

    socket.on("disconnect", () => {
      setRealtimeState("offline");
      toast.error("Realtime sync disconnected. Reconnecting...");
    });

    socket.on("system:status", ({ connected }) => {
      setRealtimeState(connected ? "live" : "connecting");
    });

    socket.on("devices:updated", (payload) => {
      setDevices(payload.devices || {});
      setLastUpdated(payload.lastUpdated || null);
      setError("");
    });

    socket.on("activity:created", ({ activity }) => {
      if (!activity) {
        return;
      }

      if (ignoredActivityIdsRef.current.has(activity.id)) {
        ignoredActivityIdsRef.current.delete(activity.id);
        return;
      }

      setActivities((currentActivities) => [activity, ...currentActivities].slice(0, 18));

      if (activity.source === "schedule") {
        toast.success(`Scheduled task executed: ${activity.message}`);
      } else if (activity.source === "scene") {
        toast.success(activity.message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const storeLocalActivity = (activity) => {
    if (!activity?.id) {
      return;
    }

    ignoredActivityIdsRef.current.add(activity.id);
    setActivities((currentActivities) => [activity, ...currentActivities].slice(0, 18));
  };

  const handleDeviceAction = async (deviceName, status, overrides = {}) => {
    const currentDevice = devices[deviceName];

    if (!currentDevice) {
      toast.error("This device is not ready yet.");
      return;
    }

    try {
      setUpdatingKey(deviceName);
      const payload = {
        status,
        ...overrides,
      };

      if (deviceName === "ac" && status === "on" && payload.temperature == null) {
        payload.temperature = currentDevice.temperature || 22;
      }

      if (deviceName === "light" && status === "on" && payload.brightness == null) {
        payload.brightness = currentDevice.brightness || 100;
      }

      const data = await saveDeviceState(deviceName, payload);
      setDevices(data.devices);
      setLastUpdated(data.lastUpdated);
      storeLocalActivity(data.activity);
      setError("");
      toast.success(`${data.device.label} is now ${data.device.status}.`);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Device update failed.");
    } finally {
      setUpdatingKey("");
    }
  };

  const handleToggleDevice = (deviceName) => {
    const config = DEVICE_CONFIG[deviceName];
    const device = devices[deviceName];

    if (!config || !device) {
      return;
    }

    const isActive = config.activeStates.includes(device.status);
    const nextStatus = isActive ? config.nextStatus.active : config.nextStatus.inactive;
    handleDeviceAction(deviceName, nextStatus);
  };

  const handleRunScene = async (sceneKey) => {
    try {
      setBusyScene(sceneKey);
      const data = await executeScene(sceneKey);
      setDevices(data.devices);
      setLastUpdated(data.lastUpdated);
      storeLocalActivity(data.activity);
      toast.success(data.activity?.message || `${data.scene.label} activated.`);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Unable to run that scene.");
    } finally {
      setBusyScene("");
    }
  };

  const handleVoiceCommand = async (spokenText) => {
    const normalized = normalizeCommand(spokenText);

    const directActions = [
      {
        matches: ["turn on light", "light on"],
        run: () => handleDeviceAction("light", "on"),
      },
      {
        matches: ["turn off light", "light off"],
        run: () => handleDeviceAction("light", "off"),
      },
      {
        matches: ["turn on fan", "fan on"],
        run: () => handleDeviceAction("fan", "on"),
      },
      {
        matches: ["turn off fan", "fan off"],
        run: () => handleDeviceAction("fan", "off"),
      },
      {
        matches: ["open door"],
        run: () => handleDeviceAction("door", "open"),
      },
      {
        matches: ["close door", "shut door"],
        run: () => handleDeviceAction("door", "closed"),
      },
      {
        matches: ["turn on ac", "ac on", "turn on air conditioner"],
        run: () => handleDeviceAction("ac", "on"),
      },
      {
        matches: ["turn off ac", "ac off", "turn off air conditioner"],
        run: () => handleDeviceAction("ac", "off"),
      },
    ];

    const actionMatch = directActions.find((command) =>
      command.matches.some((phrase) => normalized.includes(phrase))
    );

    if (actionMatch) {
      toast.success(`Voice command received: "${normalized}"`);
      await actionMatch.run();
      return;
    }

    const sceneEntry = Object.entries(VOICE_SCENE_MAP).find(([phrase]) => normalized.includes(phrase));

    if (sceneEntry) {
      toast.success(`Voice scene received: "${sceneEntry[0]}"`);
      await handleRunScene(sceneEntry[1]);
      return;
    }

    toast.error("Command not recognized. Try one of the supported phrases.");
  };

  const { isSupported, isListening, transcript, startListening, stopListening } = useVoiceControl({
    onCommand: handleVoiceCommand,
    onError: (voiceError) => {
      toast.error(`Voice control error: ${voiceError}`);
    },
  });

  const handleCreateSchedule = async (payload) => {
    try {
      setScheduleBusy(true);
      const response = await createSchedule(payload);
      setSchedules((currentSchedules) =>
        [...currentSchedules, response.schedule].sort((left, right) => left.time.localeCompare(right.time))
      );
      toast.success("Schedule created successfully.");
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Unable to save that schedule.");
    } finally {
      setScheduleBusy(false);
    }
  };

  const handleToggleSchedule = async (scheduleId, enabled) => {
    try {
      const response = await updateSchedule(scheduleId, { enabled });
      setSchedules((currentSchedules) =>
        currentSchedules.map((schedule) => (schedule.id === scheduleId ? response.schedule : schedule))
      );
      toast.success(enabled ? "Schedule enabled." : "Schedule paused.");
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Unable to update schedule.");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await removeSchedule(scheduleId);
      setSchedules((currentSchedules) => currentSchedules.filter((schedule) => schedule.id !== scheduleId));
      toast.success("Schedule removed.");
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Unable to delete schedule.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
  };

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

  const activeCount = useMemo(
    () =>
      Object.entries(devices).filter(([deviceName, device]) =>
        DEVICE_CONFIG[deviceName]?.activeStates.includes(device.status)
      ).length,
    [devices]
  );

  const statusData = useMemo(
    () => [
      { name: "Active", value: activeCount },
      { name: "Inactive", value: Math.max(0, Object.keys(DEVICE_CONFIG).length - activeCount) },
    ],
    [activeCount]
  );

  const devicePowerData = useMemo(
    () =>
      Object.entries(DEVICE_CONFIG).map(([deviceName, config]) => ({
        name: config.title.replace("Smart ", ""),
        value: config.activeStates.includes(devices[deviceName]?.status) ? 1 : 0,
        status: config.activeStates.includes(devices[deviceName]?.status) ? "ON" : "OFF",
      })),
    [devices]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AmbientBackground />

      <div className="relative mx-auto flex w-full max-w-[1600px] gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
        <Sidebar user={user} onLogout={handleLogout} />

        <div className="min-w-0 flex-1 space-y-6">
          <TopNavbar
            user={user}
            lastUpdated={lastUpdated}
            realtimeState={realtimeState}
            activeCount={activeCount}
            totalCount={Object.keys(DEVICE_CONFIG).length}
          />

            <section className="glass-panel panel-highlight rounded-[24px] p-4 sm:rounded-[32px] sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="rounded-2xl bg-rose-400/10 p-2 sm:p-3 text-rose-200">
                    <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl text-white sm:text-2xl">Dashboard sync issue</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{error}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => syncDashboard({ successMessage: "Dashboard refreshed." })}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2 sm:px-5 sm:py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry sync
                </button>
              </div>
            </section>

          <section id="overview" className="grid gap-4 sm:gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <ScenePanel onRunScene={handleRunScene} busyScene={busyScene} />
            <VoiceControlPanel
              isSupported={isSupported}
              isListening={isListening}
              transcript={transcript}
              onStart={startListening}
              onStop={stopListening}
              commands={SUPPORTED_COMMANDS}
            />
          </section>

          <section id="rooms" className="space-y-4 sm:space-y-6">
            {rooms.map((room) => (
              <RoomSection
                key={room.id}
                room={room}
                devices={devices}
                deviceConfig={DEVICE_CONFIG}
                updatingKey={updatingKey}
                onToggle={handleToggleDevice}
              />
            ))}
          </section>

          <section id="analytics">
            <AnalyticsPanel statusData={statusData} devicePowerData={devicePowerData} />
          </section>

          <section id="automation" className="space-y-4 sm:space-y-6">
            <SchedulerPanel
              schedules={schedules}
              onCreateSchedule={handleCreateSchedule}
              onToggleSchedule={handleToggleSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              isBusy={scheduleBusy}
            />
            
            <div className="flex justify-end">
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
            
            <ActivityFeed activities={activities} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
