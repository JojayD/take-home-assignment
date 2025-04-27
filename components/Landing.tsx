"use client";

import React, { useState, useEffect } from "react";
import {
	ArrowRight,
	Briefcase,
	MapPin,
	Search,
	BookMarkedIcon,
	TrendingUp,
	Star,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
interface LandingProps {
	landingVisible: boolean;
	setLandingVisible: (value: boolean) => void;
}
const Landing = ({ landingVisible, setLandingVisible }: LandingProps) => {
	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {
		// Short timeout to ensure the hero section animates first
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 800);

		return () => clearTimeout(timer);
	}, []);

	// You can remove this unused function or keep it for other purposes
	const handleVisiblityClick = () => {
		setIsVisible(!isVisible);
	};
	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.5 },
		},
	};

	return (
		<div className='bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen'>
			{/* Hero Section */}
			<div className='relative overflow-hidden'>
				{/* Background elements */}
				<div className='absolute inset-0 z-0 opacity-10'>
					<div className='absolute top-20 left-1/4 w-72 h-72 bg-orange-400 rounded-full blur-3xl'></div>
					<div className='absolute bottom-20 right-1/4 w-80 h-80 bg-yellow-300 rounded-full blur-3xl'></div>
				</div>

				{/* Hero content */}
				<div className='container mx-auto px-6 pt-32 pb-24 relative z-10'>
					<motion.div
						className='max-w-4xl mx-auto text-center'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className='text-5xl md:text-6xl font-bold text-gray-800 mb-6'>
							Find Your{" "}
							<span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600'>
								Dream Job
							</span>{" "}
							Today
						</h1>
						<p className='text-xl text-gray-600 mb-10'>
							Discover thousands of job opportunities with all the information you need
							to apply with confidence.
						</p>

						<div className='mt-6 mb-10'>
							<button
								onClick={() => setLandingVisible(false)}
								className='group inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-xl transform hover:translate-y-[-2px] transition-all duration-300'
							>
								Get Started
								<ArrowRight
									size={20}
									className='ml-2 transform transition-transform duration-300 group-hover:translate-x-1'
								/>
							</button>
						</div>

						<div className='flex flex-wrap justify-center gap-3 text-sm text-gray-600'>
							<span className='flex items-center p-2 bg-white rounded-lg shadow-sm'>
								<Briefcase
									size={16}
									className='mr-1 text-orange-500'
								/>
								<span>10,000+ Jobs</span>
							</span>
							<span className='flex items-center p-2 bg-white rounded-lg shadow-sm'>
								<MapPin
									size={16}
									className='mr-1 text-orange-500'
								/>
								<span>All Locations</span>
							</span>
							<span className='flex items-center p-2 bg-white rounded-lg shadow-sm'>
								<TrendingUp
									size={16}
									className='mr-1 text-orange-500'
								/>
								<span>Competitive Salaries</span>
							</span>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Features Section */}
			<motion.div
				className='container mx-auto px-6 py-24'
				variants={containerVariants}
				initial='hidden'
				animate={isVisible ? "visible" : "hidden"}
			>
				<div className='text-center mb-16'>
					<h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
						How It Works
					</h2>
					<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
						Your simplified job searching experience in just three easy steps
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
					<motion.div
						className='bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 transform hover:translateY-[-10px] transition-transform duration-300'
						variants={itemVariants}
					>
						<div className='w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-6 mx-auto'>
							<Search
								size={24}
								className='text-orange-500'
							/>
						</div>
						<h3 className='text-xl font-bold text-gray-800 mb-4 text-center'>
							Search Jobs
						</h3>
						<p className='text-gray-600 text-center'>
							Use our powerful search and filter tools to find the perfect job match
							for your skills and preferences.
						</p>
					</motion.div>

					<motion.div
						className='bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 transform hover:translateY-[-10px] transition-transform duration-300'
						variants={itemVariants}
					>
						<div className='w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-6 mx-auto'>
							<Star
								size={24}
								className='text-orange-500'
							/>
						</div>
						<h3 className='text-xl font-bold text-gray-800 mb-4 text-center'>
							Save Favorites
						</h3>
						<p className='text-gray-600 text-center'>
							Bookmark jobs you're interested in and build your personalized collection
							of opportunities.
						</p>
					</motion.div>

					{/* Feature 3 */}
					<motion.div
						className='bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-500 transform hover:translateY-[-10px] transition-transform duration-300'
						variants={itemVariants}
					>
						<div className='w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-6 mx-auto'>
							<Briefcase
								size={24}
								className='text-orange-500'
							/>
						</div>
						<h3 className='text-xl font-bold text-gray-800 mb-4 text-center'>
							Apply With Ease
						</h3>
						<p className='text-gray-600 text-center'>
							Get detailed job information and direct application options for a
							seamless application experience.
						</p>
					</motion.div>
				</div>
			</motion.div>

			<div className='container mx-auto mb-24'>
				<div className='flex flex-col items-center justify-center'>
					<div className='w-full md:w-4/5 lg:w-3/5 mx-auto'>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.2 }}
						>
							<div className='relative group'>
								<div className='relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg'>
									<Image
										width={700}
										height={500}
										src='/locationbased.png'
										alt='Location based job search features'
										className='w-full transform group-hover:scale-[1.02] transition-transform duration-500 rounded-2xl'
									/>
									<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8 flex items-center justify-between'>
										<div>
											<span className='inline-block px-3 py-1 bg-orange-500 text-white text-xs rounded-full mb-3'>
												FEATURED
											</span>
											<h3 className='text-white font-semibold text-xl'>
												Interactive Job Map
											</h3>
											<p className='text-gray-200 mt-1'>
												Discover jobs in your preferred location
											</p>
										</div>
										<span className='bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs border border-white/30'>
											Live Preview
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>  

			{/* CTA Section */}
			<div className='bg-white py-20'>
				<div className='container mx-auto px-6'>
					<div className='max-w-4xl mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-10 text-center text-white shadow-xl'>
						<motion.h2
							className='text-3xl md:text-4xl font-bold mb-6'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							Ready to Find Your Next Opportunity?
						</motion.h2>
						<motion.p
							className='text-xl mb-8 text-orange-50'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							Join thousands of job seekers who've found their dream jobs through our
							platform.
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<div
								className='inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold rounded-lg shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300'
								onClick={() => setLandingVisible(false)}
							>
								Browse All Jobs
								<ArrowRight
									size={18}
									className='ml-2'
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className='bg-gray-50 border-t border-gray-200 py-12'>
				<div className='container mx-auto px-6 text-center'>
					<div className='flex items-center justify-center mb-6'>
						<Briefcase
							size={24}
							className='text-orange-500 mr-2'
						/>
						<h2 className='text-xl font-bold text-gray-800'>JobHub</h2>
					</div>
					<p className='text-gray-600 mb-6'>
						Your trusted partner in finding the perfect career opportunity
					</p>
					<div className='flex justify-center space-x-4 text-gray-500'>
						<a
							href='#'
							className='hover:text-orange-500 transition-colors duration-300'
						>
							About
						</a>
						<a
							href='#'
							className='hover:text-orange-500 transition-colors duration-300'
						>
							Privacy
						</a>
						<a
							href='#'
							className='hover:text-orange-500 transition-colors duration-300'
						>
							Terms
						</a>
						<a
							href='#'
							className='hover:text-orange-500 transition-colors duration-300'
						>
							Contact
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
