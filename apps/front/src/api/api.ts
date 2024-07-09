import { ZoomMeeting, MeetingRequestParams } from '@/types/zoom'
import axios from 'axios'

const BASE_URL = 'http://localhost:4000/meetings'

export async function getMeetings() {
	const { data } = await axios.get<ZoomMeeting[]>(BASE_URL)

	return data
}

export async function createMeeting(meetingDetails: MeetingRequestParams) {
	const { data } = await axios.post<ZoomMeeting>(BASE_URL, meetingDetails)

	return data
}

export async function updateMeeting(meetingId: string, meetingDetails: Partial<MeetingRequestParams>) {
	const { data } = await axios.patch<ZoomMeeting>(`${BASE_URL}/${meetingId}`, meetingDetails)

	return data
}
