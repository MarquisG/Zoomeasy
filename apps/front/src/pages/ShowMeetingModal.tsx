import { Dialog, DialogPanel, DialogTitle , DialogBackdrop } from '@headlessui/react'

import { CalendarPlus } from 'lucide-react'
import { Meeting } from '@/types/meeting'

interface ShowMeetingModalProps {
	open: boolean
	onClose: () => void
	meeting: Meeting
}

export default function ShowMeetingModal({ open, onClose, meeting }: ShowMeetingModalProps ) {
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
									{ meeting.topic }
								</DialogTitle>
							</div>

						</div>
						<div className="mt-4 flex flex-col">
							<div className="font-bold flex">
								<p className="text-right">Time:</p>
								<p className="col-span-3 ml-2">{startHour}:{startMinute} - {endHour}:{endMinute}</p>
							</div>
						</div>
						{
							meeting.joinUrl && (
								<div className="mt-4">
									<a
										href={
											meeting.joinUrl
										}
										target="_blank"
										className="text-blue-500 underline" rel="noreferrer"
									>
										Join Meeting
									</a>
								</div>
							)
						}
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	)

}