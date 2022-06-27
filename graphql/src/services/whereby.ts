import fetch from "node-fetch";
import { WHEREBY_URL, WHEREBY_API_KEY } from "../config";

const headers = {
  Authorization: `Bearer ${WHEREBY_API_KEY}`,
  "Content-Type": "application/json",
};

/**
 * NOTE:
 * When the whereby session is complete, the file name for
 * recorded files from whereby will be automatically
 * set to [room name]-[HHhMM].mkv(mp4)
 * where:
 * - [room name] is a randomly generated uuid name by default
 * - [HHhMM] is the time when the recording started.
 * - roomNamePrefix is added infront of the room name and the
 *  recorded file name will be like roomNamePrefix_[room name]-[HHhMM].mkv/mp4.
 * so in ourcase, roomPrefix is going to be 'cohortID_'
 * This helps us to parse the cohort id when s3 events hit our lambda
 * and store the data into recordings table.
 */
async function createWhereByRoom(
  endDate: string,
  engagementId: number,
  cohortId: number
) {
  try {
    const data = {
      endDate,
      isLocked: true,
      roomMode: "group",
      fields: ["hostRoomUrl"],
      roomNamePrefix: `WHEREBY-RECORDING-${engagementId}-${cohortId}-`,
    };
    const result = await fetch(WHEREBY_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return await result.json();
  } catch (error) {
    console.error("[WHEREBY ERROR]", error);
    return null;
  }
}

async function deleteWhereByRoom(meetingId: string | null) {
  if (!meetingId) return;
  try {
    const result = await fetch(`${WHEREBY_URL}/${meetingId}`, {
      method: "DELETE",
      headers,
    });
    return await result.json();
  } catch (error) {
    console.error("[WHEREBY ERROR]", error);
    return null;
  }
}

export const WhereByService = {
  createWhereByRoom,
  deleteWhereByRoom,
};
