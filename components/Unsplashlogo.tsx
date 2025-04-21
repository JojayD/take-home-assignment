// components/UnsplashLogo.tsx
"use client";

import React, { useState } from "react";
import { getUnsplashSrc } from "../lib/unsplash";

interface Props {
	seed?: string;
	collectionId?: string;
	className?: string;
}

export function UnsplashLogo({
	seed = "",
	collectionId = "190727",
	className = "",
}: Props) {
	const [imageError, setImageError] = useState(false);
	const [useFallback, setUseFallback] = useState(false);

	// Use a different collection or a direct Unsplash photo ID that we know works
	const url = !imageError
		? seed
			? `https://source.unsplash.com/collection/${collectionId}/${seed}`
			: `https://source.unsplash.com/collection/${collectionId}/200x200`
		: !useFallback
		? "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&h=200&auto=format&fit=crop"
		: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af'%3ELogo%3C/text%3E%3C/svg%3E";

	const handleImageError = () => {
		if (!imageError) {
			setImageError(true);
		} else if (!useFallback) {
			setUseFallback(true);
		}
	};

	return (
		<img
			src={url}
			alt='Company logo'
			className={`object-cover rounded-full ${className}`}
			onError={handleImageError}
		/>
	);
}

export default UnsplashLogo;
