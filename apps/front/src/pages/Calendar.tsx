import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Meeting } from '@/types/meeting'
import { Button } from '@headlessui/react'
import CreateMeetingModal from './CreateMeetingModal'

const MINUTES_PER_SLOT = 15
const SLOTS_PER_HOUR = 60 / MINUTES_PER_SLOT
const SLOT_HEIGHT = 12 // 3rem (h-12) divided by 4 slots
const HOURS_PER_DAY = 24

export default function Calendar() {
	const [meetings, setMeetings] = useState<Meeting[]>([])

	const [showDialog, setShowDialog] = useState(false)
	const [newMeeting, setNewMeeting] = useState<Meeting>()
	const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()))
	const [draggedMeeting, setDraggedMeeting] = useState<Meeting>()
	const [draggedElementY, setDraggedElementY] = useState<number>(0)
	const [resizingMeeting, setResizingMeeting] = useState<Meeting>()
	const calendarRef = useRef<HTMLDivElement>(null)

	function getWeekStart(date: Date) {
		const d = new Date(date)
		const day = d.getDay()
		const diff = d.getDate() - day + (day === 0 ? -6 : 1)
		return new Date(d.setDate(diff))
	}

	function formatDate(date: Date) {
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
	}

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	const hours = Array.from({ length: HOURS_PER_DAY }, (_, i) => i)

	// ----------------
	// TimeSlot Component
	// ----------------
	function TimeSlot ({ date, hour, slot }: { date: Date, hour: number, slot: number }) {
		const slotDate = new Date(date)
		slotDate.setHours(hour, slot * MINUTES_PER_SLOT)
		const isPast = slotDate < new Date()

		// Function to handle drag over that prevents the default behavior
		function handleDragOver (e: React.DragEvent<HTMLDivElement>) {
			e.preventDefault()
			if (isPast) return
		}

		// Function to handle drop that sets the meeting new time
		async function handleDrop (e: React.DragEvent<HTMLDivElement>) {
			e.preventDefault()
			if (isPast) return

			const rect = e.currentTarget.getBoundingClientRect()
			const y = e.clientY - rect.top - draggedElementY
			const minutesFromTop = Math.floor((y / SLOT_HEIGHT) * MINUTES_PER_SLOT)
			const roundedMinutes = Math.round(minutesFromTop / MINUTES_PER_SLOT) * MINUTES_PER_SLOT
			const newStartTime = new Date(slotDate.setMinutes(slot * MINUTES_PER_SLOT + roundedMinutes))


			newStartTime.setSeconds(0, 0)

			if (draggedMeeting) {
				const duration = draggedMeeting.endTime - draggedMeeting.startTime
				const newEndTime = new Date(newStartTime.getTime() + duration)

				setMeetings(meetings.map(m =>
					m.id === draggedMeeting.id
					? { ...m, date: new Date(date), startTime: newStartTime.getTime(), endTime: newEndTime.getTime() }
					: m
				))

				setDraggedElementY(0)
				setDraggedMeeting(undefined)
			}
		}

		function handleNewMeeting() {
			if (isPast) return

			setNewMeeting({
				id: String(Math.random()),
				date,
				startTime: slotDate.getTime(),
				endTime: new Date(slotDate.getTime() + 60 * 60 * 1000).getTime() // Default time of 1 hour
			})

			setShowDialog(true)
		}

		return (
			<div
				className={`border-t border-gray-200 ${slot === 0 ? 'border-l' : ''} relative ${isPast ? 'bg-gray-100' : ''}`}
				style={{ height: `${SLOT_HEIGHT}px` }}
				onDragOver={ handleDragOver }
				onDrop={ handleDrop }
				onClick={ handleNewMeeting }
			>
				{
					meetings
						.filter(meeting =>
							new Date(meeting.startTime).toDateString() === date.toDateString() &&
							new Date(meeting.startTime).getHours() === hour &&
							Math.floor(new Date(meeting.startTime).getMinutes() / MINUTES_PER_SLOT) === slot
						)
						.map((meeting) => (
							<MeetingSlot key={meeting.id} meeting={meeting} />
						))
				}
			</div>
		)
	}

	// --------------------
	// MeetingSlot Component
	// --------------------
	function MeetingSlot ({ meeting }: { meeting: Meeting }) {
		const startDate = new Date(meeting.startTime)
		const endDate = new Date(meeting.endTime)
		const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60) // duration in minutes
		const height = `${(duration / MINUTES_PER_SLOT) * SLOT_HEIGHT}px`
		const top = `${((startDate.getHours() * 60 + startDate.getMinutes()) % 60) / MINUTES_PER_SLOT * SLOT_HEIGHT}px`

		// Function to handle drag start that sets the dragged meeting
		// and the y position of the mouse relative to the to of dragged element
		function handleDragStart (e: React.DragEvent<HTMLDivElement>) {
			if (!draggedMeeting) {
				setDraggedMeeting(meeting)
			}

			if (!draggedElementY) {
				const draggedElementTop = e.currentTarget.getBoundingClientRect().top
				const y = e.clientY - draggedElementTop
				setDraggedElementY(y)
			}
		}

		// Function to handle resize start that sets the resizing meeting
		function handleResizeStart (e: React.MouseEvent<HTMLDivElement>) {
			e.stopPropagation()
			setResizingMeeting(meeting)
		}

		function handleClick(e: React.MouseEvent<HTMLDivElement>) {
			e.stopPropagation()
		}

		return (
			<div
				className="absolute left-0 right-0 bg-blue-500 text-white p-1 rounded overflow-hidden cursor-move z-10"
				style={{ height, top }}
				draggable
				onDragStart={handleDragStart}
				onClick={ handleClick }
			>
				<div>
					{startDate.getHours()}:{startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes()} - {endDate.getHours()}:{endDate.getMinutes() < 10 ? `0${endDate.getMinutes()}` : endDate.getMinutes()}
				</div>
				<div className="text-xs truncate">{meeting.topic}</div>
				<div
				className="absolute bottom-0 left-0 right-0 h-2 bg-blue-700 cursor-ns-resize" 
				onMouseDown={ handleResizeStart }
				/>
			</div>
		)
	}

	function handleConfirm () {
		setShowDialog(false)
	}

	function handleNavigateWeek (direction: 'next' | 'prev') {
		const newDate = new Date(currentWeekStart)
		newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
		setCurrentWeekStart(getWeekStart(newDate))
	}

	useEffect(() => {
		function handleMouseMove (e: MouseEvent) {
			if (resizingMeeting) {
				if (calendarRef.current) {
					const calendarRect = calendarRef.current.getBoundingClientRect()
					const y = e.clientY - calendarRect.top

					const totalMinutes = Math.floor((y / (SLOT_HEIGHT * HOURS_PER_DAY * SLOTS_PER_HOUR)) * (HOURS_PER_DAY * 60))
					const roundedMinutes = Math.round(totalMinutes / MINUTES_PER_SLOT) * MINUTES_PER_SLOT
					const newEndTime = new Date(resizingMeeting.date)
					newEndTime.setHours(0, roundedMinutes - 90, 0, 0)

					if (newEndTime.getTime() > resizingMeeting.startTime) {
						setMeetings(meetings.map(m =>
							m.id === resizingMeeting.id
							? { ...m, endTime: newEndTime.getTime() }
							: m
						))
					}
				}
			}
		}

		function handleMouseUp (){
			setResizingMeeting(undefined)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [resizingMeeting, meetings])

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<Button
					className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
					onClick={() => handleNavigateWeek('prev')}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<h1 className="text-2xl font-bold">
					{formatDate(currentWeekStart)} - {formatDate(new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}
				</h1>
				<Button
					className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
					onClick={() => handleNavigateWeek('next')}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
			<div
				className="grid grid-cols-8 gap-px bg-gray-200"
				ref={ calendarRef }
			>
				<div className="col-span-1"></div>

				{
					days.map((day, index) => {
						const date = new Date(currentWeekStart)
						date.setDate(date.getDate() + index)
							return (
								<div key={day} className="font-bold text-center bg-white p-2">
								<div>{day}</div>
								<div>{formatDate(date)}</div>
								</div>
							)
					})
				}
				{
					hours.map(hour => (
					<>
						<div className="text-right pr-2 pt-2 text-xs">{hour}:00</div>
						{
							days.map((_, dayIndex) => (
								<div key={`${hour}-${dayIndex}`} className="bg-white">
									{
										Array.from({ length: SLOTS_PER_HOUR }).map((_, slotIndex) => {
											const date = new Date(currentWeekStart)
											date.setDate(date.getDate() + dayIndex)

											return (
												<TimeSlot
													key={ `${hour}-${dayIndex}-${slotIndex}` }
													date={ date }
													hour={ hour }
													slot={ slotIndex }
												/>
											)
										})
									}
								</div>
							))
						}
					</>
				))}
			</div>
			{
				newMeeting && (
					<CreateMeetingModal
						open={ showDialog }
						onClose={ () => setShowDialog(false) }
						onConfirm={ handleConfirm }
						meeting={ newMeeting }
					/>
				)
			}
		</div>
	)
}
