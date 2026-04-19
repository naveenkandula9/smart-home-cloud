import { listActivities } from "../services/activityService.js";
import { uploadToS3 } from "../services/s3Service.js";

const generateCSV = (activities) => {
  const headers = [
    "ID",
    "Type",
    "Title",
    "Message",
    "Device Name",
    "Status",
    "Source",
    "Actor Name",
    "Created At",
    "Updated At"
  ];

  const rows = activities.map(activity => [
    activity.id,
    activity.type,
    activity.title,
    activity.message,
    activity.deviceName || "",
    activity.status || "",
    activity.source,
    activity.actorName,
    activity.createdAt,
    activity.updatedAt
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
};

export const exportReport = async (request, response, next) => {
  try {
    // Fetch latest device activity logs (let's get the last 1000 for the report)
    const activities = await listActivities(1000);

    if (activities.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No activity data available for export.",
      });
    }

    // Generate CSV report
    const csvContent = generateCSV(activities);

    // Create a unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const filename = `device-activity-report-${timestamp}.csv`;

    // Upload CSV to S3
    const downloadUrl = await uploadToS3(filename, csvContent);

    // Return public download URL in JSON
    response.status(200).json({
      success: true,
      message: "Report exported successfully.",
      data: {
        downloadUrl,
        filename,
        recordCount: activities.length,
      },
    });
  } catch (error) {
    next(error);
  }
};