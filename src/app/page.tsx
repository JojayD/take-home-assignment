"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { JobRecord } from "../../types/jobRecord";
import { getAllJobs } from "../../lib/jobs";
import JobCard from "../../components/JobCard";
import SearchBar from "../../components/SearchBar";
import Link from "next/link";

import mapbox from "mapbox-gl";
import {
	ArrowLeft,
	X,
	Loader,
	Briefcase,
	MapPin,
	TrendingUp,
	BadgeCheck,
	ChevronRight,
	Star,
	Bookmark,
} from "lucide-react";
import { Avatar } from "@mui/material";
import Image from "next/image";
import { getLocalStorage, setLocalStorage } from "../../hooks/useLocalStorage";
import JobMap from "../../components/JobMap";

export default function Home() {
	const [jobs, setJobs] = useState<(JobRecord & { id: string })[]>([]);
	const [filteredJobs, setFilteredJobs] = useState<
		(JobRecord & { id: string })[]
	>([]);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const [isLoading, setIsLoading] = useState(true);
	const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	// State to track which jobs are visible on the map
	const [visibleJobs, setVisibleJobs] = useState<(JobRecord & { id: string })[]>(
		[]
	);

	// Ref for the scrollable container
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isScrolling, setIsScrolling] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	// Fetch jobs only once when component mounts
	useEffect(() => {
		let isMounted = true;
		setIsLoading(true);

		getAllJobs()
			.then((data) => {
				if (!isMounted) {
					return;
				}

				// Load bookmarked jobs from localStorage
				const savedJobs = getLocalStorage<(JobRecord & { id: string })[]>(
					"bookmarkedJobs",
					[]
				);

				// Map through jobs and check if they're bookmarked in localStorage
				const jobsWithBookmarkStatus = data.map((job) => {
					const savedJob = savedJobs.find((saved) => saved.id === job.id);
					return {
						...job,
						bookmarked: savedJob ? true : false,
					};
				});

				setTimeout(() => {
					setJobs(jobsWithBookmarkStatus);
					setFilteredJobs(jobsWithBookmarkStatus);
					setIsLoading(false);
				}, 1000);
			})
			.catch((err) => {
				if (isMounted) {
					console.error(err);
					setError("Could not load jobs");
					setIsLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	// Handler for bookmarking jobs
	const handleBookmark = useCallback(
		(job: JobRecord & { id: string }) => {
			// Toggle bookmark status
			const updatedJob = { ...job, bookmarked: !job.bookmarked };

			// Update jobs in state
			const updatedJobs = jobs.map((j) => (j.id === job.id ? updatedJob : j));
			setJobs(updatedJobs);

			// Update filtered jobs in state
			setFilteredJobs((prevFiltered) =>
				prevFiltered.map((j) => (j.id === job.id ? updatedJob : j))
			);

			// Get current bookmarks from localStorage
			const savedJobs = getLocalStorage<(JobRecord & { id: string })[]>(
				"bookmarkedJobs",
				[]
			);

			let newSavedJobs;
			if (updatedJob.bookmarked) {
				// Add to bookmarks if it's not already there
				const alreadySaved = savedJobs.some((saved) => saved.id === job.id);
				newSavedJobs = alreadySaved
					? savedJobs.map((j) => (j.id === job.id ? updatedJob : j))
					: [...savedJobs, updatedJob];
			} else {
				// Remove from bookmarks
				newSavedJobs = savedJobs.filter((j) => j.id !== job.id);
			}

			// Save updated bookmarks to localStorage
			setLocalStorage("bookmarkedJobs", newSavedJobs);
		},
		[jobs]
	);

	// Handler for viewing job details
	const handleViewDetails = (job: JobRecord) => {
		setSelectedJob(job);
		setShowDetails(true);
	};

	// Handler for closing job details
	const handleCloseDetails = () => {
		setShowDetails(false);
	};

	// Memoize so prevention of re-rendering
	const applyFilters = useCallback(
		(term: string, filter: string) => {
			if (!term.trim()) {
				setFilteredJobs([...jobs]);
				return;
			}

			const lowercasedTerm = term.toLowerCase();
			let results: (JobRecord & { id: string })[] = [];

			switch (filter) {
				case "jobTitle":
					results = jobs.filter((job) =>
						job.jobTitle.toLowerCase().includes(lowercasedTerm)
					);
					break;
				case "companyName":
					results = jobs.filter((job) =>
						job.companyName.toLowerCase().includes(lowercasedTerm)
					);
					break;
				case "all":
				default:
					results = jobs.filter(
						(job) =>
							job.jobTitle.toLowerCase().includes(lowercasedTerm) ||
							job.companyName.toLowerCase().includes(lowercasedTerm) ||
							job.location.toLowerCase().includes(lowercasedTerm) ||
							job.jobDescription.toLowerCase().includes(lowercasedTerm) ||
							job.requirements.toLowerCase().includes(lowercasedTerm)
					);
					break;
			}

			if (filter === "all" || filter === "jobTitle") {
				results.sort((a, b) => {
					const aIncludesInTitle = a.jobTitle.toLowerCase().includes(lowercasedTerm);
					const bIncludesInTitle = b.jobTitle.toLowerCase().includes(lowercasedTerm);

					if (aIncludesInTitle && !bIncludesInTitle) return -1;
					if (!aIncludesInTitle && bIncludesInTitle) return 1;
					return 0;
				});
			}
			setFilteredJobs(results);
		},
		[jobs]
	);

	// Memoize handlers to prevent recreating them on each render
	const handleSearch = useCallback(
		(term: string) => {
			setSearchTerm(term);
			applyFilters(term, activeFilter);
		},
		[activeFilter, applyFilters]
	);

	const handleFilterChange = useCallback(
		(filterType: string) => {
			setActiveFilter(filterType);
			applyFilters(searchTerm, filterType);
		},
		[searchTerm, applyFilters]
	);

	// Mouse handlers for horizontal scroll
	const handleMouseDown = (e: React.MouseEvent) => {
		if (!scrollContainerRef.current) return;
		setIsScrolling(true);
		setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
		setScrollLeft(scrollContainerRef.current.scrollLeft);
		scrollContainerRef.current.style.cursor = "grabbing";
	};

	const handleMouseUp = () => {
		if (!scrollContainerRef.current) return;
		setIsScrolling(false);
		scrollContainerRef.current.style.cursor = "grab";
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isScrolling || !scrollContainerRef.current) return;
		e.preventDefault();
		const x = e.pageX - scrollContainerRef.current.offsetLeft;
		const walk = (x - startX) * 1.5; // Scroll speed multiplier
		scrollContainerRef.current.scrollLeft = scrollLeft - walk;
	};

	const handleMouseLeave = () => {
		if (isScrolling) handleMouseUp();
	};

	// Touch handlers for mobile devices
	const handleTouchStart = (e: React.TouchEvent) => {
		if (!scrollContainerRef.current) return;
		setIsScrolling(true);
		setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
		setScrollLeft(scrollContainerRef.current.scrollLeft);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isScrolling || !scrollContainerRef.current) return;
		const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
		const walk = (x - startX) * 1.5;
		scrollContainerRef.current.scrollLeft = scrollLeft - walk;
	};

	const handleTouchEnd = () => {
		setIsScrolling(false);
	};

	// Scroll buttons handlers
	const handleScrollLeft = () => {
		if (!scrollContainerRef.current) return;
		scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
	};

	const handleScrollRight = () => {
		if (!scrollContainerRef.current) return;
		scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
	};

	if (error)
		return (
			<p className='text-red-600 text-center text-lg font-medium mt-10'>{error}</p>
		);
	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100'>
				<div className='flex flex-col items-center space-y-4 p-8 bg-white rounded-xl shadow-lg animate-pulse'>
					<Loader
						size={56}
						className='text-orange-500 animate-spin'
					/>
					<p className='text-gray-700 text-xl font-medium'>
						Loading the job that fits..
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col md:flex-row relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
			{/* First panel: Search bar + map + job list */}
			<div
				className={`w-full ${
					showDetails
						? "hidden sm:block sm:w-1/2 lg:w-3/5" // Hide on mobile when details shown
						: "block w-full" // Show full width when details hidden
				} p-6 transition-all duration-500 ease-in-out`}
			>
				<div className='max-w-5xl mx-auto'>
					{/* Navigation header with saved jobs link */}
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-bold text-gray-800'>Job Board</h1>
						<Link
							href='/saved'
							className='flex items-center px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md'
						>
							<Bookmark
								className='mr-2'
								size={18}
							/>
							<span className='font-medium'>Saved Jobs</span>
						</Link>
					</div>

					{/* Search bar and filters - positioned above map */}
					<div className='sticky top-20 z-10 bg-gray-50/95 backdrop-blur-sm rounded-xl shadow-md p-5 mb-6'>
						<div className='w-full transform hover:translate-y-[-2px] transition-transform duration-300'>
							<SearchBar
								placeholder='Search jobs...'
								onSearch={handleSearch}
								onFilterChange={handleFilterChange}
							/>
						</div>

						{/* Filter indicators */}
						<div className='flex items-center justify-between mt-3'>
							<div className='flex items-center gap-2'>
								<span className='text-sm text-gray-500'>Filter:</span>
								<div
									className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
										activeFilter === "all"
											? "bg-orange-100 text-orange-700"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
									onClick={() => handleFilterChange("all")}
								>
									All
								</div>
								<div
									className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
										activeFilter === "jobTitle"
											? "bg-orange-100 text-orange-700"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
									onClick={() => handleFilterChange("jobTitle")}
								>
									Job Title
								</div>
								<div
									className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
										activeFilter === "companyName"
											? "bg-orange-100 text-orange-700"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
									onClick={() => handleFilterChange("companyName")}
								>
									Company
								</div>
							</div>
							<div className='text-xs text-gray-500'>
								{filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""}
							</div>
						</div>
					</div>

					{/* Map - always visible */}
					<div className='mb-6 h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-200'>
						<JobMap
							jobs={filteredJobs}
							selectedJobId={selectedJob?.id}
							onMarkerClick={(jobId) => {
								const job = jobs.find((j) => j.id === jobId);
								if (job) handleViewDetails(job);
							}}
							className='w-full h-full'
						/>
					</div>

					{/* Job Listings Heading with horizontal scroll hint */}
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-xl font-bold text-gray-800'>Job Openings</h2>
						<div className='flex items-center text-sm text-gray-500'>
							<ChevronRight
								size={16}
								className='mr-1 text-orange-500'
							/>
							<span>Scroll horizontally to see more</span>
						</div>
					</div>

					{filteredJobs.length === 0 ? (
						<div className='text-gray-500 text-center py-12 bg-white rounded-xl shadow-md'>
							<div className='mb-4'>
								<X
									size={48}
									className='mx-auto text-gray-400'
								/>
							</div>
							<p className='text-xl font-medium'>
								No jobs match your search criteria.
							</p>
							<p className='mt-2'>Try adjusting your search terms or filters.</p>
						</div>
					) : (
						/* Horizontal scrolling container for job cards */
						<div className='relative'>
							{/* Left scroll button - only show if there are jobs */}
							{filteredJobs.length > 0 && (
								<button
									onClick={handleScrollLeft}
									className='absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-gray-100'
									aria-label='Scroll left'
								>
									<ArrowLeft
										size={20}
										className='text-orange-500'
									/>
								</button>
							)}

							<div
								className='overflow-x-auto pb-6 scroll-smooth scrollbar-hide'
								style={{
									WebkitOverflowScrolling: "touch",
									overflowY: "hidden",
									cursor: "grab",
								}}
								ref={scrollContainerRef}
								onMouseDown={handleMouseDown}
								onMouseUp={handleMouseUp}
								onMouseMove={handleMouseMove}
								onMouseLeave={handleMouseLeave}
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
							>
								<div className='flex space-x-6 pb-4 px-1 min-w-max pl-10 pr-10'>
									{filteredJobs.map((job) => (
										<div
											key={job.id}
											className='w-[320px] flex-shrink-0 transform hover:translate-y-[-5px] hover:shadow-xl transition-all duration-300'
										>
											<JobCard
												job={job}
												onViewDetails={() => handleViewDetails(job)}
												onBookmark={() => handleBookmark(job)}
											/>
										</div>
									))}
								</div>
							</div>

							{/* Right scroll button - only show if there are jobs */}
							{filteredJobs.length > 0 && (
								<button
									onClick={handleScrollRight}
									className='absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-gray-100'
									aria-label='Scroll right'
								>
									<ChevronRight
										size={20}
										className='text-orange-500'
									/>
								</button>
							)}

							{/* Scroll indicators/shadows */}
							{filteredJobs.length > 0 && (
								<>
									<div className='absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10'></div>
									<div className='absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10'></div>
								</>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Second panel: Job details */}
			{showDetails && selectedJob && (
				<div className='fixed sm:static top-0 right-0 bottom-0 w-full sm:w-1/2 lg:w-2/5 bg-white border-l border-gray-200 shadow-2xl z-40 overflow-y-auto transition-all duration-500 ease-in-out animate-fadeIn pt-16 sm:pt-0'>
					{/* Added pt-16 for mobile to prevent header overlap */}

					<div className='p-8 max-w-2xl mx-auto'>
						<div className='flex justify-between items-center mb-8'>
							{/* Add bookmark button in the details view */}
							<button
								className={`p-2 rounded-full ${
									selectedJob.bookmarked
										? "bg-orange-50 text-orange-500"
										: "bg-gray-100 text-gray-500"
								} hover:bg-orange-100 transition-colors duration-200`}
								onClick={() =>
									selectedJob &&
									handleBookmark(selectedJob as JobRecord & { id: string })
								}
							>
								<Bookmark
									size={20}
									className={
										selectedJob.bookmarked ? "fill-orange-500" : "fill-transparent"
									}
								/>
							</button>
						</div>

						<div className='mb-8 flex items-center'>
							<div className='w-16 h-16 mr-5 transform hover:scale-110 transition-transform duration-300'>
								<Avatar
									className='shadow-md'
									sx={{
										width: 64,
										height: 64,
										bgcolor: "orange.500",
										fontSize: "1.8rem",
									}}
								>
									{selectedJob.jobTitle[0] || ""}
								</Avatar>
							</div>
							<div>
								<h2 className='text-2xl font-bold mb-2 text-gray-800'>
									{selectedJob.jobTitle}
								</h2>
								<p className='text-gray-600 text-lg flex items-center'>
									<Briefcase
										size={18}
										className='mr-2 text-orange-500'
									/>
									{selectedJob.companyName}
								</p>
							</div>
						</div>

						<div className='mb-8 bg-gray-50 p-5 rounded-lg shadow-inner'>
							<div className='flex items-center justify-between mb-2'>
								<div className='flex items-center text-lg font-semibold text-gray-800'>
									<TrendingUp
										size={20}
										className='mr-2 text-green-500'
									/>
									{selectedJob.salary}
								</div>
								<div className='flex items-center text-gray-600'>
									<MapPin
										size={18}
										className='mr-2 text-orange-500'
									/>
									{selectedJob.location}
								</div>
							</div>
						</div>

						<div className='mb-8'>
							<h3 className='text-xl font-semibold mb-4 flex items-center text-gray-800'>
								<BadgeCheck
									size={22}
									className='mr-2 text-blue-500'
								/>
								Job Description
							</h3>
							<div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300'>
								<p className='text-gray-700 whitespace-pre-line leading-relaxed'>
									{selectedJob.jobDescription}
								</p>
							</div>
						</div>

						<div className='mb-10'>
							<h3 className='text-xl font-semibold mb-4 flex items-center text-gray-800'>
								<Star
									size={22}
									className='mr-2 text-yellow-500'
								/>
								Requirements
							</h3>
							<div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300'>
								<p className='text-gray-700 whitespace-pre-line leading-relaxed'>
									{selectedJob.requirements}
								</p>
							</div>
						</div>

						<div className='flex justify-center items-center mt-8 border-t pt-8 border-gray-200 flex-col gap-2 '>
							<Link
								href={`/jobs/${selectedJob.id}`}
								className='group block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-center font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]'
							>
								View Full Details
								<ChevronRight
									size={18}
									className='inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1'
								/>
							</Link>
							<button
								onClick={handleCloseDetails}
								className='p-2 rounded-full hover:bg-gray transition-colors duration-300 transform hover:scale-150'
								aria-label='Close details'
							>
								{/* Fixed button position on mobile */}
								<ArrowLeft
									size={24}
									className='text-gray-600 sm:hidden'
								/>
								<X
									size={22}
									className='text-red-600 hidden sm:block'
								/>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
