// components/JobCard.tsx
"use client";

import React from "react";
import {
	Bookmark,
	MapPin,
	Building2,
	CalendarClock,
	BanknoteIcon,
} from "lucide-react";
import { JobRecord } from "../types/jobRecord";
import Avatar from "@mui/material/Avatar";

type Props = {
	job: JobRecord;
	onViewDetails?: () => void;
	saveLocalStorage?: (job: JobRecord) => void;
	onDeleteLocalStorage?: (job: JobRecord) => void;
	onBookmark?: (job: JobRecord) => void;
};

export default function JobCard({
	job,
	onViewDetails,
	saveLocalStorage,
	onDeleteLocalStorage,
	onBookmark,
}: Props) {
	return (
		<div className='relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full group h-[280px]'>
			{/* Colorful top border accent */}
			<div className='h-1 bg-gradient-to-r from-orange-400 to-yellow-500'></div>

			{/* Bookmark button */}
			<button
				className='absolute top-4 right-4 p-2 rounded-full bg-white/70 backdrop-blur-sm text-gray-400 hover:text-orange-500 hover:bg-white transform transition-all duration-300 hover:scale-110 hover:rotate-[10deg] z-10'
				onClick={(e) => {
					e.stopPropagation();
					if (onBookmark) onBookmark(job);
				}}
			>
				<Bookmark
					className={`w-5 h-5 ${
						job.bookmarked ? "fill-orange-500" : "fill-transparent"
					}`}
				/>
			</button>

			<div
				className='p-6 cursor-pointer transition-all duration-300 hover:bg-gray-50 flex flex-col justify-center h-full'
				onClick={onViewDetails}
			>
				{/* Logo + Job Title */}
				<div className='flex items-center mb-5'>
					<div className='w-14 h-14 mr-4 flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300'>
						<Avatar
							sx={{
								width: 56,
								height: 56,
								bgcolor: "orange.500",
								fontSize: "1.5rem",
								boxShadow: "0 4px 12px rgba(249, 115, 22, 0.15)",
							}}
						>
							{job.jobTitle.substring(0, 2)}
						</Avatar>
					</div>
					<div className='flex flex-col'>
						<h2 className='text-xl font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors duration-300'>
							{job.jobTitle}
						</h2>
						<div className='flex items-center text-gray-600'>
							<Building2
								size={16}
								className='mr-2 text-gray-500'
							/>
							<span>{job.companyName}</span>
						</div>
					</div>
				</div>

				<div className='mb-6 flex flex-wrap items-center'>
					<div className='mr-5 text-gray-600 text-sm flex items-center mb-2'>
						<MapPin
							size={16}
							className='mr-1 text-orange-400'
						/>
						{job.location}
					</div>
					<div className='text-gray-600 text-sm flex items-center mb-2'>
						<CalendarClock
							size={16}
							className='mr-1 text-orange-400'
						/>
						{job.jobType}
					</div>
				</div>
				<div className='flex justify-between mb-4'>
					<div className='flex items-center mt-auto mb-4'>
						<div className='flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium'>
							<BanknoteIcon
								size={16}
								className='mr-2 text-green-500'
							/>
							{job.salary}
						</div>
						
					</div>
					{/* Details button at the bottom */}
					<div className=''>
						<button
							className='px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:from-orange-600 hover:to-orange-700'
							onClick={onViewDetails}
						>
							View Details
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
