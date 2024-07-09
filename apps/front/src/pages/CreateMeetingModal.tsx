import { Button, Dialog, DialogPanel, DialogTitle , DialogBackdrop, Input } from '@headlessui/react'

import { CalendarPlus } from 'lucide-react'
import { useState } from 'react'
import { Meeting } from '@/types/meeting'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

import { createMeeting } from '../api/api'

interface CreateMeetingModalProps {
	open: boolean
	onClose: () => void
	onConfirm: (meeting: Meeting) => void
	meeting: Meeting
}

export default function CreateMeetingModal({ open, onClose, onConfirm, meeting }: CreateMeetingModalProps ) {
	const [topic, setTopic] = useState<string>('')
	const [isInvalidForm, setIsInvalidForm] = useState(false)

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

	function handleInputChange (e: React.ChangeEvent<HTMLInputElement>) {
		setTopic(e.target.value)
	}

	function handleConfirm () {
		if (!topic.trim()) {
			setIsInvalidForm(true)
			return
		}

		toast.promise(
			saveMeeting(),
			{
				loading: 'Creating meeting...',
				success: 'Meeting created!',
				error: 'Failed to create meeting'
			}
		)
	}

	async function saveMeeting() {
		const startTime = new Date(meeting.startTime).toISOString()
		const formatedTime = dayjs(startTime).format('YYYY-MM-DDTHH:mm:ssZ')

		const newMeeting = await createMeeting({
			topic: topic.trim(),
			startTime: formatedTime,
			duration: (meeting.endTime - meeting.startTime) / 1000 / 60,
			timezone
		})

		onConfirm({
			...meeting,
			id: String(newMeeting.id),
			topic
		})

		setTopic('')
	}

	const startHour = new Date(meeting.startTime).getHours()
	const endHour = new Date(meeting.endTime).getHours()
	const startMinute = new Date(meeting.startTime).getMinutes() < 10 ? `0${new Date(meeting.startTime).getMinutes()}` : new Date(meeting.startTime).getMinutes()
	const endMinute = new Date(meeting.endTime).getMinutes() < 10 ? `0${new Date(meeting.endTime).getMinutes()}` : new Date(meeting.endTime).getMinutes()

	return (
		<Dialog
			open={ open }
			as="div"
			className="relative z-10 focus:outline-none"
			onClose={ onClose }
		>
			<DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full justify-center p-4 text-center items-center">
					<DialogPanel
						transition
						className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg p-4"
					>
						<div className="flex items-center">
							<div className="flex flex-shrink-0 items-center justify-center rounded-full bg-blue-100 mx-0 h-10 w-10">
								<CalendarPlus className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
									Book a Meeting
								</DialogTitle>
							</div>

						</div>
						<div className="mt-4 flex flex-col">
							<div className="font-bold flex">
								<p className="text-right">Selected time:</p>
								<p className="col-span-3 ml-2">{startHour}:{startMinute} - {endHour}:{endMinute}</p>
							</div>
							<div className="mt-4">
								<label htmlFor="subject" className="block text-sm font-bold text-gray-900">
									Subject
								</label>
								<p className="text-sm text-gray-400">
									Please enter a subject for the meeting
								</p>
								<Input
									id="subject"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									value={topic || ''}
									onChange={ handleInputChange }
								/>
							</div>
						</div>
						{
							isInvalidForm && (
								<p className="text-red-500 text-sm mt-2">
									Please enter a subject for the meeting
								</p>
							)
						}
						<div className="mt-4 flex">
							<Button
								className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
								onClick={ onClose }
							>
								Cancel
							</Button>
							<Button
								className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
								onClick={ handleConfirm }
							>
								Confirm
							</Button>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	)

}