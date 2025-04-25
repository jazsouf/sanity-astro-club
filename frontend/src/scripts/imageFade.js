const init = () => {
	// Retrieve all images with the 'fade-in' class.
	const images = document.querySelectorAll("img.fade-in");

	// Set up load handlers to add a 'loaded' class when images finish loading.
	for (const image of images) {
		image.onload = () => {
			image.classList.add("loaded"); // Mark the image as loaded.
		};

		// If the image is already cached, trigger the load handler immediately.
		if (image.complete) {
			image.onload();
		}
	}
};

// Initialize fade-in effects on Astro page load.
document.addEventListener("astro:page-load", init);
