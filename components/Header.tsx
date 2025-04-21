"use client";

import React, { useState } from "react";
import {
	House,
	Contact,
	PersonStanding,
	Menu,
	X,
	Briefcase,
} from "lucide-react";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className='bg-orange-500 text-white p-4 shadow-md sticky top-0 z-50'>
			<div className='container mx-auto flex justify-between items-center'>
				<div className='flex items-center gap-2'>
					<Briefcase
						size={24}
						className='text-white'
					/>
					<h1 className='text-2xl font-bold'>Job Listings</h1>
				</div>

				{/* Mobile menu button */}
				<button
					className='md:hidden p-2 rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300'
					onClick={toggleMenu}
					aria-label='Toggle menu'
				>
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				{/* Desktop Navigation */}
				<nav className='hidden md:block'>
					<ul className='flex space-x-6'>
						<li>
							<a
								href='/'
								className='flex items-center gap-2 px-3 py-2 font-medium transition-colors hover:text-orange-200 hover:bg-orange-600/40 rounded-md'
							>
								<House size={18} />
								Home
							</a>
						</li>
						<li>
							<a
								href='/'
								className='flex items-center gap-2 px-3 py-2 font-medium transition-colors hover:text-orange-200 hover:bg-orange-600/40 rounded-md'
							>
								<Contact size={18} />
								Contact
							</a>
						</li>
						<li>
							<a
								href='/'
								className='flex items-center gap-2 px-3 py-2 font-medium transition-colors hover:text-orange-200 hover:bg-orange-600/40 rounded-md'
							>
								<PersonStanding size={18} />
								About
							</a>
						</li>
					</ul>
				</nav>
			</div>

			{/* Mobile Navigation - Slide down menu */}
			{isMenuOpen && (
				<div className='md:hidden mt-4 py-2 px-1 bg-orange-600 rounded-lg shadow-lg animate-slideDown'>
					<ul className='flex flex-col space-y-2'>
						<li>
							<a
								href='/'
								className='flex items-center gap-2 px-4 py-3 rounded-md hover:bg-orange-500 transition-colors'
								onClick={toggleMenu}
							>
								<House size={18} />
								<span className='font-medium'>Home</span>
							</a>
						</li>
						<li>
							<a
								href='/'
								className='flex items-center gap-2 px-4 py-3 rounded-md hover:bg-orange-500 transition-colors'
								onClick={toggleMenu}
							>
								<Contact size={18} />
								<span className='font-medium'>Contact</span>
							</a>
						</li>
						<li>
							<a
								href='/'
								className='flex items-center gap-2 px-4 py-3 rounded-md hover:bg-orange-500 transition-colors'
								onClick={toggleMenu}
							>
								<PersonStanding size={18} />
								<span className='font-medium'>About</span>
							</a>
						</li>
					</ul>
				</div>
			)}
		</header>
	);
};

export default Header;
