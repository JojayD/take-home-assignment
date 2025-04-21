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
	tags?: string[]; 
	companyLogoUrl?: string; 
};
