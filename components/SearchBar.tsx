import React, { useState, useEffect, useCallback } from "react";
import { Search, X, Filter, ChevronDown } from "lucide-react";

interface SearchBarProps {
	placeholder?: string;
	onSearch: (searchTerm: string) => void;
	onFilterChange?: (filterType: string) => void;
	className?: string;
}

const SearchBar = ({
	placeholder = "Search...",
	onSearch,
	onFilterChange,
	className = "",
}: SearchBarProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [activeFilter, setActiveFilter] = useState<string>("all");

	const [initialRender, setInitialRender] = useState(true);

	// Handle search term changes with debounce
	useEffect(() => {
		// Skip the initial render to prevent immediate search
		if (initialRender) {
			setInitialRender(false);
			return;
		}

		// Trigger search with current term
		onSearch(searchTerm);
	}, [searchTerm, onSearch, initialRender]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Only trigger search on explicit submit
		onSearch(searchTerm);
	};

	const handleClearSearch = () => {
		setSearchTerm("");
		// Explicitly trigger search with empty string
		onSearch("");
	};

	const handleFilterSelect = (filterType: string) => {
		setActiveFilter(filterType);
		setIsFilterOpen(false);
		if (onFilterChange) {
			onFilterChange(filterType);
		}
	};

	const filterOptions = [
		{ id: "all", label: "All" },
		{ id: "jobTitle", label: "Job Title" },
		{ id: "companyName", label: "Company Name" },
	];

	return (
		<div className='w-full max-w-xl'>
			<form
				className={`flex items-center w-full px-4 py-3 bg-gray-100 rounded-lg ${className}`}
				onSubmit={handleSubmit}
			>
				<Search
					size={20}
					className='flex-shrink-0 mr-3 text-gray-500'
				/>
				<input
					type='text'
					className='flex-1 w-full py-1 text-base bg-transparent border-none outline-none text-gray-800 placeholder-gray-500'
					placeholder={placeholder}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
				{searchTerm && (
					<button
						type='button'
						className='flex items-center justify-center p-1 ml-2 text-gray-500 transition-colors rounded-full hover:bg-gray-200'
						onClick={handleClearSearch}
						aria-label='Clear search'
					>
						<X size={16} />
					</button>
				)}
				<div className='relative ml-2'>
					<button
						type='button'
						className='flex items-center justify-center p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-200'
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						aria-label='Filter options'
					>
						<Filter size={16} />
						<ChevronDown
							size={14}
							className='ml-1'
						/>
					</button>

					{isFilterOpen && (
						<div className='absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg z-10 border border-gray-100'>
							<div className='py-1'>
								{filterOptions.map((option) => (
									<button
										key={option.id}
										type='button'
										className={`block w-full text-left px-4 py-2 text-sm ${
											activeFilter === option.id
												? "bg-yellow-100 text-yellow-800"
												: "text-gray-700 hover:bg-gray-100"
										}`}
										onClick={() => handleFilterSelect(option.id)}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</form>
			{activeFilter !== "all" && (
				<div className='mt-2 text-sm text-gray-500'>
					Filtering by:{" "}
					<span className='font-medium'>
						{filterOptions.find((opt) => opt.id === activeFilter)?.label}
					</span>
				</div>
			)}
		</div>
	);
};

export default SearchBar;
