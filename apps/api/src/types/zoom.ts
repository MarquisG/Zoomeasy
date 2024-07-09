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

export interface ZoomAuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
}

export interface ZoomMeetingRequest {
	topic: string;
	start_time: string; // in ISO 8601 format
	duration: number; // in minutes
	timezone: string;
}

