import cron from "node-cron";
import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { applyDeviceUpdate } from "./deviceService.js";

const scheduledJobs = new Map();

const getCronExpression = (time) => {
  const [hour, minute] = time.split(":");
  return `${minute} ${hour} * * *`;
};

const stopJob = (scheduleId) => {
  const existingJob = scheduledJobs.get(scheduleId);

  if (existingJob) {
    existingJob.stop();
    scheduledJobs.delete(scheduleId);
  }
};

const executeScheduledTask = async (scheduleId) => {
  const schedule = await Schedule.findById(scheduleId).lean();

  if (!schedule || !schedule.enabled) {
    stopJob(scheduleId);
    return;
  }

  const user = await User.findById(schedule.userId).select("_id name email").lean();

  await applyDeviceUpdate({
    deviceName: schedule.deviceName,
    status: schedule.action,
    temperature: schedule.temperature,
    brightness: schedule.brightness,
    actor: user,
    source: "schedule",
  });

  await Schedule.findByIdAndUpdate(scheduleId, {
    $set: {
      lastRunAt: new Date(),
    },
  });
};

export const registerScheduleJob = (schedule) => {
  stopJob(schedule._id.toString());

  if (!schedule.enabled) {
    return;
  }

  const job = cron.schedule(
    getCronExpression(schedule.time),
    async () => {
      try {
        await executeScheduledTask(schedule._id.toString());
      } catch (error) {
        console.error(`Failed to execute schedule ${schedule._id}:`, error);
      }
    },
    {
      scheduled: true,
      timezone: env.schedulerTimezone,
    }
  );

  scheduledJobs.set(schedule._id.toString(), job);
};

export const unregisterScheduleJob = (scheduleId) => {
  stopJob(scheduleId);
};

export const initializeScheduleJobs = async () => {
  const schedules = await Schedule.find({ enabled: true }).lean();
  schedules.forEach(registerScheduleJob);
};
