import { listActivities } from "../services/activityService.js";

export const getActivities = async (request, response, next) => {
  try {
    const limit = Number(request.query.limit) || 20;
    const activities = await listActivities(Math.min(limit, 50));

    response.status(200).json({
      success: true,
      data: {
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};
