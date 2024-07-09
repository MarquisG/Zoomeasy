export interface ZoomMeeting {
	uuid: string;
	id: number;
	host_id: string;
	topic: string;
	type: number;
	start_time: string; // in ISO 8601 format
	duration: number; // in minutes
	timezone: string;
	created_at: string;
	join_url: string;
}

export interface MeetingRequestParams {
	topic: string;
	startTime: string; // in ISO 8601 format
	duration: number; // in minutes
	timezone: string;
}

