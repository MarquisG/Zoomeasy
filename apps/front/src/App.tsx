import { useEffect, useState } from 'react'
import Calendar from './pages/Calendar'
import { Meeting } from './types/meeting'
import { getMeetings } from './api/api'
import { Toaster } from 'react-hot-toast'


export default function App() {
	const [meetings, setMeetings] = useState<Meeting[]>([])
	const [isLoaded, setIsLoaded] = useState<boolean>(false)

	useEffect(() => {
		async function fetchMeetings() {
			const zoomMeetings = await getMeetings()

			const meetings = zoomMeetings.map(meeting => ({
				id: String(meeting.id),
				topic: meeting.topic,
				date: new Date(meeting.start_time),
				startTime: new Date(meeting.start_time).getTime(),
				endTime: new Date(meeting.start_time).getTime() + meeting.duration * 60 * 1000,
				joinUrl: meeting.join_url
			}))

			setMeetings(meetings)

			setIsLoaded(true)
		}

		fetchMeetings()
	}, [])

	if (!isLoaded) return (<div>Loading...</div>)

	return (
		<>
			<Calendar meetings={ meetings } />
			<Toaster />
		</>
	)
}