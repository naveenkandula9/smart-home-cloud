import { ROOM_DEFINITIONS, SCENE_PRESETS } from "../utils/deviceDefaults.js";
import {
  applyDeviceUpdate,
  applyScene,
  getDevicesSnapshot,
  seedDefaultDevices,
} from "../services/deviceService.js";

export const getDevices = async (_request, response, next) => {
  try {
    await seedDefaultDevices();
    const snapshot = await getDevicesSnapshot();

    response.status(200).json({
      success: true,
      data: {
        devices: snapshot.devices,
        lastUpdated: snapshot.lastUpdated,
        rooms: ROOM_DEFINITIONS,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (request, response, next) => {
  try {
    const { deviceName } = request.params;
    const { status, temperature, brightness } = request.body;
    const result = await applyDeviceUpdate({
      deviceName,
      status,
      temperature,
      brightness,
      actor: request.user,
      source: "manual",
    });

    response.status(200).json({
      success: true,
      message: `${result.device.label} updated successfully.`,
      data: {
        device: result.device,
        devices: result.snapshot.devices,
        lastUpdated: result.snapshot.lastUpdated,
        activity: result.activity,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const runScene = async (request, response, next) => {
  try {
    const { sceneName } = request.params;

    if (!SCENE_PRESETS[sceneName]) {
      return response.status(404).json({
        success: false,
        message: "Scene not found.",
      });
    }

    const result = await applyScene(sceneName, request.user);

    response.status(200).json({
      success: true,
      message: `${result.scene.label} activated.`,
      data: {
        scene: result.scene,
        devices: result.snapshot.devices,
        lastUpdated: result.snapshot.lastUpdated,
        activity: result.activity,
      },
    });
  } catch (error) {
    next(error);
  }
};
