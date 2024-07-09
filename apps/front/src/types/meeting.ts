export interface Meeting {
	id: string;
	date: Date; // Day of the meeting
	startTime: number; // Timestamp
	endTime: number; // Timestamp
	topic?: string;
	joinUrl?: string;
}

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'