"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobRecord } from "../../../../types/jobRecord";
import { getJobById } from "../../../../lib/jobs";
import UnsplashLogo from "../../../../components/Unsplashlogo";
import { ArrowLeft, Calendar, MapPin, Building, Tag } from "lucide-react";
import Link from "next/link";

export default function JobDetailPage() {
	const params = useParams();
	const router = useRouter();
	const jobId = params.jobId as string;

	const [job, setJob] = useState<(JobRecord & { id: string }) | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadJob() {
			try {
				setIsLoading(true);
				const foundJob = await getJobById(jobId);

				if (foundJob) {
					setJob(foundJob);
				} else {
					setError("Job not found");
				}
			} catch (err) {
				console.error(err);
				setError("Failed to load job details");
			} finally {
				setIsLoading(false);
			}
		}

		loadJob();
	}, [jobId]);

	if (isLoading) {
		return (
			<div className='container mx-auto p-6 flex justify-center items-center min-h-[60vh]'>
				<p className='text-lg'>Loading job details...</p>
			</div>
		);
	}

	if (error || !job) {
		return (
			<div className='container mx-auto p-6 flex flex-col items-center min-h-[60vh]'>
				<p className='text-red-500 text-lg mb-4'>{error || "Job not found"}</p>
				<Link
					href='/'
					className='text-orange-500 hover:underline flex items-center gap-2'
				>
					<ArrowLeft size={16} />
					Back to job listings
				</Link>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-6 max-w-5xl'>
			{/* Back button */}
			<Link
				href='/'
				className='inline-flex items-center text-gray-600 hover:text-orange-500 mb-6'
			>
				<ArrowLeft
					size={18}
					className='mr-2'
				/>
				Back to job listings
			</Link>

			{/* Job header */}
			<div className='bg-white rounded-xl p-6 shadow-md mb-8'>
				<div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
					<div className='w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0'>
						<UnsplashLogo
							seed={jobId}
							className='w-full h-full object-cover'
						/>
					</div>
					<div className='flex-1'>
						<h1 className='text-3xl font-bold mb-2'>{job.jobTitle}</h1>
						<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-600'>
							<div className='flex items-center'>
								<Building
									size={16}
									className='mr-2'
								/>
								<span>{job.companyName}</span>
							</div>
							<div className='flex items-center'>
								<MapPin
									size={16}
									className='mr-2'
								/>
								<span>{job.location}</span>
							</div>
							{job.datePosted && (
								<div className='flex items-center'>
									<Calendar
										size={16}
										className='mr-2'
									/>
									<span>Posted {job.datePosted}</span>
								</div>
							)}
						</div>
					</div>
					{job.salary && (
						<div className='bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold'>
							{job.salary}
						</div>
					)}
				</div>

				{/* Tags */}
				{job.tags && job.tags.length > 0 && (
					<div className='mt-6 flex flex-wrap gap-2'>
						{job.tags.map((tag) => (
							<div
								key={tag}
								className='flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm'
							>
								<Tag
									size={14}
									className='mr-1'
								/>
								{tag}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Job content */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2'>
					<div className='bg-white rounded-xl p-6 shadow-md mb-6'>
						<h2 className='text-2xl font-bold mb-4'>Job Description</h2>
						<div className='prose max-w-none text-gray-700 whitespace-pre-line'>
							{job.jobDescription}
						</div>
					</div>

					<div className='bg-white rounded-xl p-6 shadow-md'>
						<h2 className='text-2xl font-bold mb-4'>Requirements</h2>
						<div className='prose max-w-none text-gray-700 whitespace-pre-line'>
							{job.requirements}
						</div>
					</div>
				</div>

				<div className='lg:col-span-1'>
					<div className='bg-white rounded-xl p-6 shadow-md sticky top-24'>
						<h2 className='text-xl font-bold mb-4'>Apply for this position</h2>
						<p className='text-gray-600 mb-6'>
							Submit your application for {job.jobTitle} at {job.companyName}
						</p>

						<button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors mb-4'>
							Apply Now
						</button>

						<button className='w-full border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 rounded-lg font-medium transition-colors'>
							Save Job
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
