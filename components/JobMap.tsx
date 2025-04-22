"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { JobRecord } from "../types/jobRecord";
import cityCoordinates from "../data/longitudes";
interface JobMapProps {
	jobs: (JobRecord & { id: string })[];
	selectedJobId?: string;
	onMarkerClick?: (jobId: string) => void;
	className?: string;
}

const JobMap = ({
	jobs,
	selectedJobId,
	onMarkerClick,
	className = "",
}: JobMapProps) => {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<mapboxgl.Map | null>(null);
	const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
	const [loaded, setLoaded] = useState(false);

	// Initialize map
	useEffect(() => {
    console.log("Initializing map with Mapbox GL JS");
    console.log("Mapbox GL JS version:", mapboxgl.version);
    console.log("Mapbox access token:", process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
		if (!mapContainer.current || map.current) return;

		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/light-v11",
			center: [-98.5795, 39.8283], // US center by default
			zoom: 3,
			interactive: true,
		});

		map.current.on("load", () => {
			setLoaded(true);
		});

		// Add zoom/navigation controls
		map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

		return () => {
			if (map.current) {
				map.current.remove();
				map.current = null;
			}
		};
	}, []);

	// Add markers for job locations
	useEffect(() => {
		if (!map.current || !loaded || jobs.length === 0) return;

		// Clear existing markers
		Object.values(markers.current).forEach((marker) => marker.remove());
		markers.current = {};

		// Bounds to fit all markers
		const bounds = new mapboxgl.LngLatBounds();

		// Create markers for all jobs with valid coordinates
		jobs.forEach((job) => {
			// Get coordinates for this location from cityCoordinates
			const coordinates =
				cityCoordinates[job.location as keyof typeof cityCoordinates];

			if (coordinates) {
				// Create custom marker element
				const el = document.createElement("div");
				el.className = `job-map-marker ${
					job.id === selectedJobId ? "selected" : ""
				}`;

				// Create popup with job info
				const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="font-medium text-sm">${job.jobTitle}</div>
            <div class="text-xs text-gray-600">${job.companyName}</div>
            <div class="text-xs mt-1">${job.location}</div>
          `);

				// Create and add the marker using longitude/latitude from cityCoordinates
				const marker = new mapboxgl.Marker(el)
					.setLngLat([coordinates.longitude, coordinates.latitude])
					.setPopup(popup)
					.addTo(map.current!);

				// Add marker to bounds
				bounds.extend([coordinates.longitude, coordinates.latitude]);

				// Add click handler
				if (onMarkerClick) {
					marker.getElement().addEventListener("click", () => {
						onMarkerClick(job.id);
					});
				}

				markers.current[job.id] = marker;
			}
		});

		// Fit map to show all markers with padding
		if (!bounds.isEmpty()) {
			map.current.fitBounds(bounds, {
				padding: 50,
				maxZoom: 12,
			});
		}

		// If there's a selected job, center on it
		if (selectedJobId) {
			const selectedJob = jobs.find((j) => j.id === selectedJobId);
			if (selectedJob) {
				const coordinates =
					cityCoordinates[selectedJob.location as keyof typeof cityCoordinates];
				if (coordinates) {
					map.current.flyTo({
						center: [coordinates.longitude, coordinates.latitude],
						zoom: 12,
						speed: 1.2,
					});
				}
			}
		}
	}, [jobs, selectedJobId, loaded, onMarkerClick]);

	return (
		<div
			className={`relative rounded-xl overflow-hidden shadow-lg border border-gray-200 ${className}`}
		>
			<div
				ref={mapContainer}
				className='w-full h-full'
			/>
			{!loaded && (
				<div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
				</div>
			)}
		</div>
	);
};

export default JobMap;
