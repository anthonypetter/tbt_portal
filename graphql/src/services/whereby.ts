import nodeFetch from 'node-fetch'
import axios from "axios"
import { WHEREBY_URL, WHEREBY_API_KEY } from '../config'

const headers = {
    Authorization: `Bearer ${WHEREBY_API_KEY}`,
    "Content-Type": "application/json",
}

async function createWhereByRoom(startDate: string, endDate: string) {
    try {
        const data = {
            startDate,
            endDate,
            isLocked: true,
            roomMode: "group",
            fields: ["hostRoomUrl"],
        }
        const result = await axios.post(WHEREBY_URL, data, { headers })
        return result.data
    } catch (error) {
        throw error
    }
}

async function deleteWhereByRoom(meetingId: string | null) {
    if (!meetingId) return
    try {
        const result = await axios.delete(`${WHEREBY_URL}/${meetingId}`, {headers})
        return  result.data
    } catch (error) {
        throw error
    }
}

export const WhereByService = {
    createWhereByRoom,
    deleteWhereByRoom
}
