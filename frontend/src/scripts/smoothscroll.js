import { gsap } from "gsap";
import Lenis from "lenis";

// Initializes smooth scrolling with Lenis.
// Function to set up smooth scrolling.
export const initSmoothScrolling = () => {
	// Initialize Lenis for smooth scroll effects. Lerp value controls the smoothness.
	const lenis = new Lenis({ lerp: 0.15 });

	// Ensure GSAP animations are in sync with Lenis' scroll frame updates.
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000); // Convert GSAP's time to milliseconds for Lenis.
	});

	// Turn off GSAP's default lag smoothing to avoid conflicts with Lenis.
	gsap.ticker.lagSmoothing(0);
};
