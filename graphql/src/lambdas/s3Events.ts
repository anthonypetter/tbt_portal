import { prisma } from "@lib/prisma-client";
import { S3Event, S3Handler } from "aws-lambda";
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  S3_RECORDINGS_BUCKET,
  AWS_REGION,
  AWS_ACCESS_ID,
  AWS_SECRET_ACCESS_KEY,
} from "../config";

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const s3EventsHandler: S3Handler = async (event: S3Event) => {
  if (!isWherebyS3ObjectCreationEvent(event)) {
    return;
  }

  const objectKey = event.Records[0].s3.object.key;
  const objectCopied = await copyS3ObjectToFolder(objectKey);
  if (objectCopied) {
    await updateCohortSessionRecording(objectKey);
  }
};

function isWherebyS3ObjectCreationEvent(event: S3Event): boolean {
  const eventRecord = event.Records[0];
  return (
    eventRecord.eventSource === "aws:s3" &&
    eventRecord.eventName.startsWith("ObjectCreated:") &&
    eventRecord.s3.object.key.startsWith("WHEREBY-RECORDING")
  );
}

async function updateCohortSessionRecording(objectKey: string) {
  try {
    const { cohortId, roomName, destinationPath } =
      getS3PathElements(objectKey);

    await prisma.cohortSession.updateMany({
      where: { AND: [{ cohortId }, { roomName }] },
      data: { recording: destinationPath },
    });
  } catch (error) {
    console.error("[S3Events Handler ERROR]:", error);
  }
}

async function copyS3ObjectToFolder(objectKey: string) {
  try {
    const { destinationPath } = getS3PathElements(objectKey);

    const copyBucketCommand = new CopyObjectCommand({
      Bucket: S3_RECORDINGS_BUCKET,
      CopySource: `${process.env.AWS_S3_BUCKET}/${objectKey}`,
      Key: destinationPath,
    });

    const deleteBucketParams = new DeleteObjectCommand({
      Bucket: S3_RECORDINGS_BUCKET,
      Key: objectKey,
    });

    await s3.send(copyBucketCommand);
    await s3.send(deleteBucketParams);
    return true;
  } catch (error) {
    console.error("[S3 Copy ERROR]: ", error);
    return false;
  }
}

function getS3PathElements(key: string) {
  /**           0       1        2                    3            4        5 (starttime + file extension)
   * key is WHEREBY-RECORDING-actualEngagementId-actualCohortId-roomName-startTime
   */
  const keyParts = key.split("-");
  if (keyParts.length < 6) {
    throw new Error("Object key is not in a correct format or missing details");
  }
  const engagementId = parseInt(keyParts[2]);
  const cohortId = parseInt(keyParts[3]);
  const roomName = keyParts[4];
  const roomRecordedFileName = `${roomName}${keyParts[5]}`;
  const destinationPath = `${engagementId}/${cohortId}/recording/${roomRecordedFileName}`;

  return { cohortId, roomName, destinationPath };
}

exports.handler = s3EventsHandler;
