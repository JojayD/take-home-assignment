"use client";
import { useState, useEffect } from "react";
import { JobRecord } from "../../../types/jobRecord";
import JobCard from "../../../components/JobCard";
import Link from "next/link";
import { ArrowLeft, Bookmark, X } from "lucide-react";
import { getLocalStorage, setLocalStorage } from "../../../hooks/useLocalStorage";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<(JobRecord & { id: string })[]>([]);

  useEffect(() => {
    // Load saved jobs from localStorage when component mounts
    const jobs = getLocalStorage("bookmarkedJobs", []);
    // Filter to only show bookmarked jobs
    setSavedJobs(jobs.filter((job: JobRecord & { id: string }) => job.bookmarked));
  }, []);

  const handleRemoveBookmark = (job: JobRecord & { id: string }) => {
    // Update the job's bookmark status
    const updatedJobs = savedJobs.map(j => 
      j.id === job.id ? { ...j, bookmarked: false } : j
    );
    
    // Update localStorage with all jobs (including non-bookmarked)
    setLocalStorage("bookmarkedJobs", updatedJobs);
    
    // Update the UI to only show remaining bookmarked jobs
    setSavedJobs(updatedJobs.filter(j => j.bookmarked));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-500 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-x-[-2px]"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to job listings
          </Link>
          
          <div className="px-4 py-2 bg-orange-100 rounded-lg flex items-center text-orange-600">
            <Bookmark size={18} className="mr-2 fill-orange-500" />
            <span className="font-medium">Saved Jobs: {savedJobs.length}</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4 border-gray-200">
          Your Saved Jobs
        </h1>

        {savedJobs.length === 0 ? (
          <div className="text-gray-500 text-center py-12 bg-white rounded-xl shadow-md">
            <div className="mb-4">
              <Bookmark size={48} className="mx-auto text-gray-400" />
            </div>
            <p className="text-xl font-medium">
              No saved jobs yet
            </p>
            <p className="mt-2">Browse jobs and bookmark the ones you're interested in</p>
            <Link
              href="/"
              className="mt-6 inline-block px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="transform hover:translate-y-[-5px] hover:shadow-xl transition-all duration-300"
              >
                <JobCard
                  job={job}
                  onViewDetails={() => window.location.href = `/jobs/${job.id}`}
                  onBookmark={() => handleRemoveBookmark(job)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}