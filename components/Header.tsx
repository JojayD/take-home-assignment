"use client";

import React, { useState, useEffect } from "react";
import {
  House,
  Contact,
  Menu,
  X,
  Briefcase,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for floating appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function to determine if link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 ${
        scrolled 
          ? "py-2 translate-y-0" 
          : "py-4 md:translate-y-2"
      }`}
    >
      <div 
        className={`mx-auto max-w-6xl rounded-full flex items-center justify-between transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg text-gray-800 border border-gray-100" 
            : "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-xl"
        } py-3 px-5 md:px-8`}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className={`p-1.5 rounded-full transition-colors ${
            scrolled ? "bg-orange-100 text-orange-500" : "bg-orange-400/30 text-white"
          } group-hover:scale-110 transform transition-transform`}>
            <Briefcase size={20} />
          </div>
          <h1 className="text-lg md:text-xl font-bold">JobHub</h1>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-full p-2 hover:bg-orange-100/20 transition-colors focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-1">
            <li>
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition-all ${
                  isActive("/") 
                    ? (scrolled ? "bg-orange-100 text-orange-600" : "bg-orange-400/30 text-white") 
                    : "hover:bg-orange-100/20"
                }`}
              >
                <House size={16} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition-all ${
                  isActive("/contact") 
                    ? (scrolled ? "bg-orange-100 text-orange-600" : "bg-orange-400/30 text-white") 
                    : "hover:bg-orange-100/20"
                }`}
              >
                <Contact size={16} />
                <span>Contact</span>
              </Link>
            </li>
            <li>
              <Link
                href="/saved"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition-all ${
                  isActive("/saved") 
                    ? (scrolled ? "bg-orange-100 text-orange-600" : "bg-orange-400/30 text-white") 
                    : "hover:bg-orange-100/20"
                }`}
              >
                <BookMarked size={16} />
                <span>Saved</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation - Slide down menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-[90%] py-2 px-1 bg-white rounded-2xl shadow-xl animate-slideDown border border-gray-100">
          <ul className="flex flex-col">
            <li>
              <Link
                href="/"
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors ${
                  isActive("/") 
                    ? "bg-orange-50 text-orange-600" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={toggleMenu}
              >
                <House size={18} />
                <span className="font-medium">Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors ${
                  isActive("/contact") 
                    ? "bg-orange-50 text-orange-600" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={toggleMenu}
              >
                <Contact size={18} />
                <span className="font-medium">Contact</span>
              </Link>
            </li>
            <li>
              <Link
                href="/saved"
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors ${
                  isActive("/saved") 
                    ? "bg-orange-50 text-orange-600" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={toggleMenu}
              >
                <BookMarked size={18} />
                <span className="font-medium">Saved</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
