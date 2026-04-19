import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["device", "scene", "schedule", "auth", "system"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    deviceName: {
      type: String,
      default: null,
      enum: ["light", "fan", "door", "ac", null],
    },
    status: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      default: "manual",
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actorName: {
      type: String,
      default: "System",
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
