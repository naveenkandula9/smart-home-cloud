import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

const s3Client = new S3Client({
  region: env.awsRegion,
  credentials: {
    accessKeyId: env.awsAccessKeyId,
    secretAccessKey: env.awsSecretAccessKey,
  },
});

export const uploadToS3 = async (key, body, contentType = "text/csv") => {
  const command = new PutObjectCommand({
    Bucket: env.awsS3Bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: "public-read", // Make the file publicly accessible
  });

  await s3Client.send(command);

  // Return the public URL
  return `https://${env.awsS3Bucket}.s3.${env.awsRegion}.amazonaws.com/${key}`;
};