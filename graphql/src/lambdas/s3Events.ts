import { prisma } from "@lib/prisma-client";
import { S3Event, S3EventRecord, S3Handler } from "aws-lambda";

const s3EventsHandler: S3Handler = async (event: S3Event) => {
  if (!isWherebyS3ObjectCreationEvent(event)) {
    return;
  }

  const eventRecord = event.Records[0];
  await updateCohortSessionRecording(eventRecord);
};

function isWherebyS3ObjectCreationEvent(event: S3Event): boolean {
  const eventRecord = event.Records[0];
  return (
    eventRecord.eventSource === "aws:s3" &&
    eventRecord.eventName.startsWith("ObjectCreated:") &&
    eventRecord.s3.object.key.startsWith("WHEREBY-RECORDING-COHORT-ID")
  );
}

async function updateCohortSessionRecording(record: S3EventRecord) {
  const key = record.s3.object.key;
  /**           0       1        2    3       4            5     6
   * key is WHEREBY-RECORDING-COHORT-ID-actualCohortId-roomName-startTime
   */
  const keyParts = key.split("-");
  const cohortId = parseInt(keyParts[4]);
  const roomName = keyParts[5];
  try {
    await prisma.cohortSession.updateMany({
      where: { AND: [{ cohortId }, { roomName }] },
      data: { recording: key },
    });
  } catch (error) {
    console.error("[S3Events Handler ERROR]:", error);
  }
}

exports.handler = s3EventsHandler;
