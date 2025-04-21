export function getUnsplashSrc({
	width = 50,
	height = 50,
	collectionId = "190727",
}: {
	width?: number;
	height?: number;
	collectionId?: string;
} = {}) {
	return `https://source.unsplash.com/collection/${collectionId}/${width}x${height}`;
}
