import Activity from "../models/Activity.js";
import { emitSocketEvent } from "./socketService.js";

const formatActivity = (activity) => ({
  id: activity._id,
  type: activity.type,
  title: activity.title,
  message: activity.message,
  deviceName: activity.deviceName,
  status: activity.status,
  source: activity.source,
  metadata: activity.metadata,
  actorName: activity.actorName,
  createdAt: activity.createdAt,
  updatedAt: activity.updatedAt,
});

export const createActivity = async (payload, { emit = true } = {}) => {
  const activity = await Activity.create(payload);
  const formattedActivity = formatActivity(activity.toObject());

  if (emit) {
    emitSocketEvent("activity:created", {
      activity: formattedActivity,
    });
  }

  return formattedActivity;
};

export const listActivities = async (limit = 20) => {
  const activities = await Activity.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return activities.map(formatActivity);
};
