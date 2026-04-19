export const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "Awaiting first sync";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

export const getRelativeSyncLabel = (timestamp) => {
  if (!timestamp) {
    return "Not synced yet";
  }

  const difference = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.max(0, Math.floor(difference / 1000));

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const formatScheduleTime = (timeValue) => {
  if (!timeValue) {
    return "--:--";
  }

  const [hours, minutes] = timeValue.split(":").map(Number);
  const previewDate = new Date();
  previewDate.setHours(hours || 0, minutes || 0, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(previewDate);
};

export const formatShortTimeLabel = (timestamp) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
