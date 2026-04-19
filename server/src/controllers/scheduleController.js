import Schedule from "../models/Schedule.js";
import { registerScheduleJob, unregisterScheduleJob } from "../services/scheduleService.js";
import { DEVICE_STATUS_RULES } from "../utils/deviceDefaults.js";

const formatSchedule = (schedule) => ({
  id: schedule._id,
  name: schedule.name,
  userId: schedule.userId,
  deviceName: schedule.deviceName,
  action: schedule.action,
  time: schedule.time,
  temperature: schedule.temperature,
  brightness: schedule.brightness,
  enabled: schedule.enabled,
  lastRunAt: schedule.lastRunAt,
  createdAt: schedule.createdAt,
  updatedAt: schedule.updatedAt,
});

const validateSchedulePayload = ({ deviceName, action, time, temperature, brightness }) => {
  if (!deviceName || !DEVICE_STATUS_RULES[deviceName]) {
    const error = new Error("Choose a valid device for this schedule.");
    error.statusCode = 400;
    throw error;
  }

  if (!action || !DEVICE_STATUS_RULES[deviceName].includes(action)) {
    const error = new Error("Choose a valid action for this device.");
    error.statusCode = 400;
    throw error;
  }

  if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    const error = new Error("Schedule time must use 24-hour HH:mm format.");
    error.statusCode = 400;
    throw error;
  }

  if (deviceName === "ac" && action === "on") {
    const nextTemperature = Number(temperature ?? 22);

    if (!Number.isFinite(nextTemperature) || nextTemperature < 16 || nextTemperature > 30) {
      const error = new Error("AC schedules require a temperature between 16 and 30.");
      error.statusCode = 400;
      throw error;
    }
  }

  if (deviceName === "light" && action === "on" && brightness != null) {
    const nextBrightness = Number(brightness);

    if (!Number.isFinite(nextBrightness) || nextBrightness < 0 || nextBrightness > 100) {
      const error = new Error("Light brightness must be between 0 and 100.");
      error.statusCode = 400;
      throw error;
    }
  }
};

export const getSchedules = async (request, response, next) => {
  try {
    const schedules = await Schedule.find({ userId: request.user._id }).sort({ time: 1 }).lean();

    response.status(200).json({
      success: true,
      data: {
        schedules: schedules.map(formatSchedule),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createSchedule = async (request, response, next) => {
  try {
    const { name, deviceName, action, time, temperature, brightness } = request.body;

    validateSchedulePayload({
      deviceName,
      action,
      time,
      temperature,
      brightness,
    });

    const schedule = await Schedule.create({
      userId: request.user._id,
      name: name?.trim() || `${deviceName} ${action} at ${time}`,
      deviceName,
      action,
      time,
      temperature: deviceName === "ac" ? Number(temperature ?? 22) : null,
      brightness: deviceName === "light" ? Number(brightness ?? 100) : null,
      enabled: true,
    });

    registerScheduleJob(schedule.toObject());

    response.status(201).json({
      success: true,
      data: {
        schedule: formatSchedule(schedule),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (request, response, next) => {
  try {
    const { scheduleId } = request.params;
    const schedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, userId: request.user._id },
      {
        $set: {
          enabled: Boolean(request.body.enabled),
        },
      },
      {
        new: true,
      }
    );

    if (!schedule) {
      return response.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    registerScheduleJob(schedule.toObject());

    response.status(200).json({
      success: true,
      data: {
        schedule: formatSchedule(schedule),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (request, response, next) => {
  try {
    const { scheduleId } = request.params;
    const deletedSchedule = await Schedule.findOneAndDelete({
      _id: scheduleId,
      userId: request.user._id,
    });

    if (!deletedSchedule) {
      return response.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    unregisterScheduleJob(scheduleId);

    response.status(200).json({
      success: true,
      data: {
        id: scheduleId,
      },
    });
  } catch (error) {
    next(error);
  }
};
