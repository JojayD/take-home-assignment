// types/jobRecord.ts
export type JobRecord = {
	id: string;
	jobTitle: string;
	companyName: string;
	location: string;
	jobDescription: string;
	requirements: string;
	datePosted?: string;
	salary?: string;
	companyLogoUrl?: string;
	bookmarked?: boolean;
	coordinates?: {
		latitude: number;
		longitude: number;
	};
};
