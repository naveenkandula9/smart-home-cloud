import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["light", "fan", "door", "ac"],
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    rooms: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ["on", "off", "open", "closed"],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
