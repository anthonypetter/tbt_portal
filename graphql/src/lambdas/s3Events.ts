import { prisma } from "@lib/prisma-client";
import { S3ObjectCreatedNotificationEvent } from "aws-lambda";

const s3EventsHandler = async (
  event: S3ObjectCreatedNotificationEvent
): Promise<void> => {
  try {
    const object = event.detail.object;
    const key = object.key;
    const cohortId = parseInt(key.split("_")[0]);
    await prisma.cohortSession.create({ data: { recording: key, cohortId } });
  } catch (error) {
    console.log("[ERROR]: s3 events handler error", error);
  }
};

exports.handler = s3EventsHandler;
