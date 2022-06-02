import fetch from "node-fetch";
import { WHEREBY_URL, WHEREBY_API_KEY } from "../config";

const headers = {
  Authorization: `Bearer ${WHEREBY_API_KEY}`,
  "Content-Type": "application/json",
};

async function createWhereByRoom(startDate: string, endDate: string) {
  try {
    const data = {
      startDate,
      endDate,
      isLocked: true,
      roomMode: "group",
      fields: ["hostRoomUrl"],
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
