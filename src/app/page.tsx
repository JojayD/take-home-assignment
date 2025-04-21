"use client";
import { useState, useEffect, useCallback } from "react";
import { JobRecord } from "../../types/jobRecord";
import { getAllJobs } from "../../lib/jobs";
import JobCard from "../../components/JobCard";
import SearchBar from "../../components/SearchBar";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import UnsplashLogo from "../../components/Unsplashlogo";

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

	// Fetch jobs only once when component mounts
	useEffect(() => {
		let isMounted = true;
		setIsLoading(true);

		getAllJobs()
			.then((data) => {
				if (isMounted) {
					setJobs(data);
					setFilteredJobs(data);
					setIsLoading(false);
				}
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

	if (error) return <p className='text-red-600'>{error}</p>;
	if (isLoading) return <p>Loading jobs…</p>;

	return (
		<div className='flex flex-col md:flex-row relative min-h-screen bg-gray-50'>
			{/* First panel: Search bar + job list */}
			<div
				className={`w-full ${
					showDetails ? "md:w-1/2 lg:w-3/5" : "w-full"
				} p-4 transition-all duration-300`}
			>
				<div className='max-w-5xl mx-auto'>
					<div className='mb-6'>
						<SearchBar
							placeholder='Search jobs...'
							onSearch={handleSearch}
							onFilterChange={handleFilterChange}
						/>
					</div>
					<h1 className='text-2xl font-bold mb-6 text-gray-800'>
						Job Openings ({filteredJobs.length})
					</h1>
					{filteredJobs.length === 0 ? (
						<p className='text-gray-500 text-center py-8'>
							No jobs match your search criteria.
						</p>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{filteredJobs.map((job) => (
								<JobCard
									key={job.id}
									job={job}
									onViewDetails={() => handleViewDetails(job)}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Second panel: Job details */}
			{showDetails && selectedJob && (
				<div className='fixed md:static top-0 right-0 bottom-0 w-full md:w-1/2 lg:w-2/5 bg-white border-l border-gray-200 shadow-lg z-40 overflow-y-auto transition-all duration-300 ease-in-out'>
					<div className='p-6 max-w-2xl mx-auto'>
						<div className='flex justify-between items-center mb-6'>
							<button
								onClick={handleCloseDetails}
								className='md:hidden p-2 rounded-full hover:bg-gray-100'
								aria-label='Close details'
							>
								<ArrowLeft size={20} />
							</button>
							<button
								onClick={handleCloseDetails}
								className='hidden md:block p-2 rounded-full hover:bg-gray-100'
								aria-label='Close details'
							>
								<X size={20} />
							</button>
						</div>

						<div className='mb-6 flex items-center'>
							<div className='w-16 h-16 mr-4'>
								<UnsplashLogo
									seed={selectedJob.id}
									className='w-full h-full'
								/>
							</div>
							<div>
								<h2 className='text-2xl font-bold mb-1'>{selectedJob.jobTitle}</h2>
								<p className='text-gray-600 text-lg'>{selectedJob.companyName}</p>
							</div>
						</div>

						<div className='mb-6'>
							<div className='flex items-center mb-4'>
								<div className='text-lg font-semibold mr-4'>{selectedJob.salary}</div>
								<div className='text-gray-600'>{selectedJob.location}</div>
							</div>
							{selectedJob.tags && (
								<div className='flex flex-wrap gap-2 mb-4'>
									{selectedJob.tags.map((tag) => (
										<span
											key={tag}
											className='px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full'
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>

						<div className='mb-6'>
							<h3 className='text-xl font-semibold mb-3'>Job Description</h3>
							<p className='text-gray-700 whitespace-pre-line'>
								{selectedJob.jobDescription}
							</p>
						</div>

						<div className='mb-8'>
							<h3 className='text-xl font-semibold mb-3'>Requirements</h3>
							<p className='text-gray-700 whitespace-pre-line'>
								{selectedJob.requirements}
							</p>
						</div>

						<div className='mt-6 border-t pt-6'>
							<Link
								href={`/jobs/${selectedJob.id}`}
								className='block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-center font-medium rounded-lg transition-colors'
							>
								View Full Details
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
