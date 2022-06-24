import { prisma } from "@lib/prisma-client";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

const wherebyHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const eventBody = JSON.parse(event.body || "{}");

  // currently support session started whereby event
  if (eventBody.type !== "room.session.started") {
    return {
      body: "Event type not supported yet",
      statusCode: 400,
    };
  }

  const meetingId = eventBody.data.meetingId;
  const cohort = await prisma.cohort.findFirst({
    where: { meetingId },
    select: { id: true },
  });

  const cohortId = cohort?.id;

  // if no cohort is related to the current meeting session
  // session started event object has meetingId

  if (!cohortId) {
    return {
      body: "Room session is not related to any cohort",
      statusCode: 400,
    };
  }

  const roomName = eventBody.data.roomName.replace("/", "");

  await prisma.cohortSession.create({
    data: {
      cohortId,
      createdAt: eventBody.createdAt,
      roomName, // we need this value because it also exists on s3 notification and helps for update
    },
  });

  return {
    body: "cohort session created",
    statusCode: 200,
  };
};

exports.handler = wherebyHandler;
