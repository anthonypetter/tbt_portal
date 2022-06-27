import { prisma } from "@lib/prisma-client";
import { S3Event, S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import { S3_BUCKET } from "../config";

AWS.config.loadFromPath("../keys/aws.json");
AWS.config.update({ region: "us-east-2" });

const s3 = new AWS.S3();

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
  const { cohortId, roomName, destinationPath } = getS3PathElements(objectKey);

  try {
    await prisma.cohortSession.updateMany({
      where: { AND: [{ cohortId }, { roomName }] },
      data: { recording: destinationPath },
    });
  } catch (error) {
    console.error("[S3Events Handler ERROR]:", error);
  }
}

async function copyS3ObjectToFolder(objectKey: string) {
  const { destinationPath } = getS3PathElements(objectKey);
  try {
    const copyBucketParams = {
      Bucket: S3_BUCKET,
      CopySource: `${process.env.AWS_S3_BUCKET}/${objectKey}`,
      Key: destinationPath,
    };

    const deleteBucketParams = {
      Bucket: S3_BUCKET,
      Key: objectKey,
    };

    await s3.copyObject(copyBucketParams);
    await s3.deleteObject(deleteBucketParams);
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
  const engagementId = parseInt(keyParts[2]);
  const cohortId = parseInt(keyParts[3]);
  const roomName = keyParts[4];
  const roomRecordedFileName = `${roomName}${keyParts[5]}`;
  const destinationPath = `${engagementId}/${cohortId}/recording/${roomRecordedFileName}`;

  return { cohortId, roomName, destinationPath };
}

exports.handler = s3EventsHandler;
