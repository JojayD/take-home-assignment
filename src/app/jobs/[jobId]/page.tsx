"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobRecord } from "../../../../types/jobRecord";
import { getJobById } from "../../../../lib/jobs";
import {
	ArrowLeft,
	Calendar,
	MapPin,
	Building,
	Tag,
	Briefcase,
	Globe,
	Clock,
	CheckCircle,
	XCircle,
	Star,
	Heart,
	Share2,
	ChevronRight,
	Bookmark,
	BanknoteIcon,
} from "lucide-react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import {
	getLocalStorage,
	setLocalStorage,
} from "../../../../hooks/useLocalStorage";

const randomTypeOfJob = [
	"Full-time",
	"Part-time",
	"Contract",
	"Internship",
	"Remote",
];
const randomExperience = [
	"Entry-level",
	"Mid-level",
	"Senior-level",
	"Internship",
];
export default function JobDetailPage() {
	const params = useParams();
	const router = useRouter();
	const jobId = params.jobId as string;

	const [job, setJob] = useState<(JobRecord & { id: string }) | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaved, setIsSaved] = useState(false);

	useEffect(() => {
		async function loadJob() {
			try {
				setIsLoading(true);
				const foundJob = await getJobById(jobId);

				if (foundJob) {
					setJob(foundJob);

					// Check if the job is already saved
					const savedJobs = getLocalStorage<(JobRecord & { id: string })[]>(
						"bookmarkedJobs",
						[]
					);
					const jobIsSaved = savedJobs.some(
						(savedJob) => savedJob.id === foundJob.id
					);
					setIsSaved(jobIsSaved);
				} else {
					setError("Job not found");
				}
			} catch (err) {
				console.error(err);
				setError("Failed to load job details");
			} finally {
				// Add a small delay to show loading animation
				setTimeout(() => {
					setIsLoading(false);
				}, 800);
			}
		}

		loadJob();
	}, [jobId]);

	const handleSaveJob = () => {
		if (!job) return;

		// Get current saved jobs from local storage
		const savedJobs = getLocalStorage<(JobRecord & { id: string })[]>(
			"bookmarkedJobs",
			[]
		);

		// Check if the job is already saved
		const isAlreadySaved = savedJobs.some((savedJob) => savedJob.id === job.id);

		let updatedSavedJobs;
		if (isAlreadySaved) {
			// Remove the job if it's already saved
			updatedSavedJobs = savedJobs.filter((savedJob) => savedJob.id !== job.id);
			setIsSaved(false);
		} else {
			// Add the job to saved jobs
			updatedSavedJobs = [...savedJobs, job];
			setIsSaved(true);
		}

		// Update local storage
		setLocalStorage("bookmarkedJobs", updatedSavedJobs);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
				<div className='flex flex-col items-center space-y-4 p-8 bg-white rounded-xl shadow-lg animate-pulse'>
					<div className='w-16 h-16 rounded-full border-4 border-t-orange-500 border-r-orange-300 border-b-orange-200 border-l-orange-400 animate-spin'></div>
					<p className='text-gray-700 text-xl font-medium'>Loading job details...</p>
				</div>
			</div>
		);
	}

	if (error || !job) {
		return (
			<div className='container mx-auto p-10 flex flex-col items-center min-h-[60vh] animate-fadeIn'>
				<div className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'>
					<XCircle
						size={48}
						className='mx-auto text-red-500 mb-4'
					/>
					<p className='text-red-500 text-xl font-semibold mb-6'>
						{error || "Job not found"}
					</p>
					<Link
						href='/'
						className='inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300'
					>
						<ArrowLeft
							size={18}
							className='mr-2'
						/>
						Back to job listings
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 animate-fadeIn'>
			<div className='container mx-auto px-4 py-6 max-w-6xl'>
				{/* Back button */}
				<Link
					href='/'
					className='inline-flex items-center text-gray-600 hover:text-orange-500 mb-8 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-x-[-2px] mt-12'
				>
					<ArrowLeft
						size={18}
						className='mr-2'
					/>
					Back to job listings
				</Link>

				{/* Job header */}
				<div className='bg-white rounded-xl p-8 shadow-lg mb-8 border-t-4 border-orange-500 transform hover:translateY-[-2px] transition-transform duration-300'>
					<div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
						<div className='w-20 h-20 flex-shrink-0 transform hover:scale-105 transition-all duration-300'>
							<Avatar
								sx={{
									width: 80,
									height: 80,
									bgcolor: "orange.500",
									fontSize: "2rem",
									boxShadow: "0 4px 12px rgba(249, 115, 22, 0.15)",
								}}
							>
								{job.jobTitle[0] || "J"}
							</Avatar>
						</div>
						<div className='flex-1'>
							<h1 className='text-3xl font-bold mb-3 text-gray-800'>{job.jobTitle}</h1>
							<div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-gray-600'>
								<div className='flex items-center group'>
									<Building
										size={18}
										className='mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300'
									/>
									<span className='group-hover:text-orange-500 duration-300'>
										{job.companyName}
									</span>
								</div>
								<div className='flex items-center group'>
									<MapPin
										size={18}
										className='mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300'
									/>
									<span className='group-hover:text-orange-500 duration-300'>
										{job.location}
									</span>
								</div>
								{job.datePosted && (
									<div className='flex items-center group'>
										<Calendar
											size={18}
											className='mr-2 text-orange-500 group-hover:scale-110 transition-transform duration-300'
										/>
										<span className='group-hover:text-orange-500 duration-300'>
											Posted {job.datePosted}
										</span>
									</div>
								)}
							</div>
						</div>
						{job.salary && (
							<div>
								<div className='bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-300'>
									{job.salary}
								</div>
							</div>
						)}
					</div>

					<div className='flex flex-wrap gap-4 mt-8 border-t border-gray-100 pt-6'>
						<button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md'>
							<Share2
								size={18}
								className='text-blue-500'
							/>
							<span>Share</span>
						</button>
						<button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md'>
							<Bookmark
								size={18}
								className='text-purple-500'
							/>
							<span>Bookmark</span>
						</button>
					</div>
				</div>

				{/* Job content */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					<div className='lg:col-span-2'>
						{/* Job highlights */}
						<div className='bg-white rounded-xl p-6 shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300 overflow-hidden'>
							<div className='flex items-center mb-4'>
								<Star
									size={22}
									className='text-yellow-500 mr-2'
								/>
								<h2 className='text-xl font-bold text-gray-800'>Job Highlights</h2>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
								<div className='bg-blue-50 p-4 rounded-xl flex items-center'>
									<Globe
										size={24}
										className='text-blue-500 mr-3'
									/>
									<div>
										<p className='text-sm text-blue-700 font-medium'>Job Type</p>
										<p className='text-gray-800'>
											{randomTypeOfJob[Math.floor(Math.random() * randomTypeOfJob.length)]}
										</p>
									</div>
								</div>
								<div className='bg-green-50 p-4 rounded-xl flex items-center'>
									<Clock
										size={24}
										className='text-green-500 mr-3'
									/>
									<div>
										<p className='text-sm text-green-700 font-medium'>Experience</p>
										<p className='text-gray-800'>
											{
												randomExperience[
													Math.floor(Math.random() * randomExperience.length)
												]
											}
										</p>
									</div>
								</div>
								<div className='bg-purple-50 p-4 rounded-xl flex items-center'>
									<Briefcase
										size={24}
										className='text-purple-500 mr-3'
									/>
									<div>
										<p className='text-sm text-purple-700 font-medium'>Industry</p>
										<p className='text-gray-800'>{"Technology"}</p>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-white rounded-xl p-6 shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300'>
							<div className='flex items-center mb-6'>
								<CheckCircle
									size={22}
									className='text-green-500 mr-2'
								/>
								<h2 className='text-xl font-bold text-gray-800'>Job Description</h2>
							</div>
							<div className='prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed'>
								{job.jobDescription}
							</div>
						</div>

						<div className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300'>
							<div className='flex items-center mb-6'>
								<CheckCircle
									size={22}
									className='text-blue-500 mr-2'
								/>
								<h2 className='text-xl font-bold text-gray-800'>Requirements</h2>
							</div>
							<div className='prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed'>
								{job.requirements}
							</div>
						</div>
					</div>

					<div className='lg:col-span-1'>
						<div className='bg-white rounded-xl p-6 shadow-lg sticky top-24 border-t-4 border-orange-500 hover:shadow-xl transition-shadow duration-300'>
							<h2 className='text-xl font-bold mb-6 text-gray-800'>
								Apply for this position
							</h2>
							<p className='text-gray-600 mb-6'>
								Submit your application for {job.jobTitle} at {job.companyName}
							</p>

							<button className='group w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] mb-4 flex justify-center items-center'>
								Apply Now
								<ChevronRight
									size={18}
									className='inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1'
								/>
							</button>

							<button
								onClick={handleSaveJob}
								className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
									isSaved
										? "bg-orange-500 text-white hover:bg-orange-600"
										: "border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
								}`}
							>
								{isSaved ? "Remove saved" : "Save Job"}
							</button>

							<div className='mt-8 pt-6 border-t border-gray-100'>
								<h3 className='font-semibold text-gray-800 mb-2'>Share this job</h3>
								<div className='flex gap-3'>
									<button className='p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-sm hover:shadow-md transform hover:scale-110 transition-transform duration-300'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='18'
											height='18'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
										</svg>
									</button>
									<button className='p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 shadow-sm hover:shadow-md transform hover:scale-110 transition-transform duration-300'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='18'
											height='18'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
										</svg>
									</button>
									<button className='p-2.5 bg-blue-700 text-white rounded-full hover:bg-blue-800 shadow-sm hover:shadow-md transform hover:scale-110 transition-transform duration-300'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='18'
											height='18'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
											<rect
												x='2'
												y='9'
												width='4'
												height='12'
											></rect>
											<circle
												cx='4'
												cy='4'
												r='2'
											></circle>
										</svg>
									</button>
									<button className='p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-sm hover:shadow-md transform hover:scale-110 transition-transform duration-300'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='18'
											height='18'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
											<polyline points='22,6 12,13 2,6'></polyline>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
