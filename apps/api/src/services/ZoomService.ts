import axios from 'axios'
import { ZoomAuthResponse, ZoomMeeting, ZoomMeetingRequest } from 'types/zoom'

export async function getAccessToken() {
	const { data } = await axios.post<ZoomAuthResponse>('https://zoom.us/oauth/token', {
		account_id: process.env.ZOOM_ACCOUNT_ID,
		grant_type: 'account_credentials'
	}, {
		headers: {
			Authorization: `Basic ${process.env.ZOOM_TOKEN}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})

	return data
}

export async function getMeetings(accessToken: string) {
	const { data } = await axios.get<{ meetings: ZoomMeeting[] }>(
		'https://api.zoom.us/v2/users/me/meetings',
		{
			headers:
				{
					Authorization: `Bearer ${accessToken}`
				}
		}
	)

	return data
}

export async function createMeeting(accessToken: string, meetingDetails: ZoomMeetingRequest) {
	const { data } = await axios.post<ZoomMeeting>(
		'https://api.zoom.us/v2/users/me/meetings',
		meetingDetails,
		{
			headers:
				{
					Authorization: `Bearer ${accessToken}`
				}
		}
	)

	return data
}

export async function updateMeeting(accessToken: string, meetingId: string, meetingDetails: Partial<ZoomMeetingRequest>) {
	const { data } = await axios.patch<ZoomMeeting>(
		`https://api.zoom.us/v2/meetings/${meetingId}`,
		meetingDetails,
		{
			headers:
				{
					Authorization: `Bearer ${accessToken}`
				}
		}
	)

	return data
}
