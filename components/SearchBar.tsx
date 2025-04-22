import React, { useState, useEffect, useCallback } from "react";
import { Search, X, Filter, ChevronDown, SlidersHorizontal } from "lucide-react";

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
		{ id: "all", label: "All Fields", icon: <SlidersHorizontal size={14} className="mr-2 text-orange-500" /> },
		{ id: "jobTitle", label: "Job Title", icon: <Search size={14} className="mr-2 text-blue-500" /> },
		{ id: "companyName", label: "Company Name", icon: <Search size={14} className="mr-2 text-green-500" /> },
	];

	return (
		<div className='w-full max-w-xl'>
			<form
				className={`flex items-center w-full px-5 py-3.5 bg-white rounded-xl ${
					isFocused ? 'ring-2 ring-orange-300 shadow-lg' : 'shadow-md'
				} transition-all duration-300 ease-in-out ${className}`}
				onSubmit={handleSubmit}
			>
				<Search
					size={20}
					className={`flex-shrink-0 mr-3 ${
						isFocused ? 'text-orange-500' : 'text-gray-500'
					} transition-colors duration-300`}
				/>
				<input
					type='text'
					className='flex-1 w-full py-1 text-base bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 transition-all duration-300'
					placeholder={placeholder}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
				{searchTerm && (
					<button
						type='button'
						className='flex items-center justify-center p-1.5 ml-2 text-gray-500 transition-all duration-300 rounded-full hover:bg-gray-100 hover:text-red-500 transform hover:rotate-90'
						onClick={handleClearSearch}
						aria-label='Clear search'
					>
						<X size={16} />
					</button>
				)}
				<div className='relative ml-2'>
					<button
						type='button'
						className={`flex items-center justify-center p-2 transition-all duration-300 rounded-full ${
							isFilterOpen ? 'bg-orange-100 text-orange-600 z-100' : 'text-gray-500 hover:bg-gray-100 z-100'
						}`}
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						aria-label='Filter options'
					>
						<Filter size={16} className="mr-1" />
						<ChevronDown
							size={14}
							className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
						/>
					</button>

					{isFilterOpen && (
						<div className='absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl z-10 border border-gray-100 animate-slideDown overflow-hidden'>
							<div className='py-2'>
								{filterOptions.map((option) => (
									<button
										key={option.id}
										type='button'
										className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
											activeFilter === option.id
												? 'bg-orange-50 text-orange-700 font-medium'
												: 'text-gray-700 hover:bg-gray-50'
										}`}
										onClick={() => handleFilterSelect(option.id)}
									>
										{option.icon}
										{option.label}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</form>
			{activeFilter !== "all" && (
				<div className='mt-3 ml-1 text-sm flex items-center animate-fadeIn'>
					<span className='px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 font-medium flex items-center'>
						{filterOptions.find((opt) => opt.id === activeFilter)?.icon}
						Filtering by: {filterOptions.find((opt) => opt.id === activeFilter)?.label}
						<button 
							onClick={() => handleFilterSelect("all")}
							className="ml-2 p-0.5 rounded-full hover:bg-orange-200 transition-colors"
						>
							<X size={12} />
						</button>
					</span>
				</div>
			)}
		</div>
	);
};

export default SearchBar;

