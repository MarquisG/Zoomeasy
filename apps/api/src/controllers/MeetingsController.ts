import { Router } from 'express'
import { createMeeting, getAccessToken, getMeetings, updateMeeting } from '../services/ZoomService'

const MeetingsController = Router()


MeetingsController.get(
	'/',
	async (_req, res) => {
		const { access_token } = await getAccessToken()

		const { meetings } = await getMeetings(access_token)

		return res.status(200).send(meetings)
	}
)

MeetingsController.post(
	'/',
	async (req, res) => {
		const body = req.body as { topic: string, startTime: string, duration: number, timezone: string }

		if (!body.topic || !body.startTime || !body.duration || !body.timezone) {
			return res.status(400).send('Missing required fields')
		}

		const { access_token } = await getAccessToken()

		const meeting = await createMeeting(access_token, {
			topic: body.topic,
			start_time: body.startTime,
			duration: body.duration,
			timezone: body.timezone
		})


		return res.status(200).send(meeting)
	}
)

MeetingsController.patch(
	'/:meetingId',
	async (req, res) => {
		const body = req.body as { topic?: string, startTime?: string, duration?: number }
		const meetingId = req.params.meetingId

		const { access_token } = await getAccessToken()

		const meeting = await updateMeeting(
			access_token,
			meetingId,
			{
				topic: body.topic,
				start_time: body.startTime,
				duration: body.duration
			}
		)

		return res.status(200).send(meeting)
	}
)

export { MeetingsController }
