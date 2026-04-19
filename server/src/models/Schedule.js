import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    deviceName: {
      type: String,
      required: true,
      enum: ["light", "fan", "door", "ac"],
    },
    action: {
      type: String,
      required: true,
      enum: ["on", "off", "open", "closed"],
    },
    time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    temperature: {
      type: Number,
      default: null,
      min: 16,
      max: 30,
    },
    brightness: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    lastRunAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
