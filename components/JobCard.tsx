// components/JobCard.tsx
"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { JobRecord } from "../types/jobRecord";
import UnsplashLogo from "./Unsplashlogo";

type Props = {
	job: JobRecord;
	onViewDetails?: () => void;
};

export default function JobCard({ job, onViewDetails }: Props) {
	return (
		<div className='relative bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition w-full'>
			{/* Bookmark button */}
			<button className='absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600'>
				<Bookmark className='w-5 h-5' />
			</button>

			<div className='p-5'>
				{/* Logo + Job Title */}
				<div className='flex items-center mb-5'>
					<div className='w-12 h-12 mr-3 flex-shrink-0'>
						<UnsplashLogo
							seed={`${job.id || Math.random().toString(36).substring(7)}`}
							className='w-full h-full'
						/>
					</div>
					<div className='flex flex-col'>
						<h2 className='text-lg font-medium text-gray-800'>Title: {job.jobTitle}</h2>
						<h2 className='text-lg font-medium text-gray-500'>Company: {job.companyName}</h2>
					</div>
				</div>

				{/* Location */}
				<div className='mb-4 text-gray-600 text-sm'>{job.location}</div>

				{/* Details button at the bottom */}
				<div className='flex justify-end'>
					<button
						className='px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 transition'
						onClick={onViewDetails}
					>
						Details
					</button>
				</div>
			</div>
		</div>
	);
}
