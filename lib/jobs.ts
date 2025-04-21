import { JobRecord } from "../types/jobRecord";
import Papa from "papaparse";

const headerMap: Record<string, keyof JobRecord> = {
	"Job Title": "jobTitle",
	"Company Name": "companyName",
	Location: "location",
	"Job Description": "jobDescription",
	Requirements: "requirements",
};

// Create a deterministic ID based on the job details
function createJobId(job: JobRecord, index: number): string {
	const baseId = `${job.jobTitle}-${job.companyName}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") 
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, ""); 

	const idSuffix = index.toString().padStart(3, "0");
	return `${baseId}-${idSuffix}`;
}

// Cache to store the jobs after first fetch to ensure consistent IDs
let jobsCache: (JobRecord & { id: string })[] | null = null;

export async function getAllJobs(): Promise<(JobRecord & { id: string })[]> {
	// Return from cache if available
	if (jobsCache) {
		return jobsCache;
	}

	const response = await fetch("/jobs.csv");
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const csv = await response.text();

	const result = Papa.parse<JobRecord>(csv, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (hdr) => {
			const key = hdr.trim();
			return headerMap[key] ?? key;
		},
	});

	// Use the index in the array for consistent ID generation
	jobsCache = result.data.map((job, index) => ({
		...job,
		id: createJobId(job, index),
	}));

	return jobsCache;
}

export async function getJobById(
	id: string
): Promise<(JobRecord & { id: string }) | undefined> {
	const jobs = await getAllJobs();
	return jobs.find((job) => job.id === id);
}
