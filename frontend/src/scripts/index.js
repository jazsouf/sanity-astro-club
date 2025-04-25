import gsap from "gsap";

// DOM elements and animation-related variables
let lines;
let textSliders;
let gridContainer;
let gridItems;
let hasPreloaderComponent;
let animationTimeline; // GSAP timeline instance

// Initialize DOM elements used in the animations.
const initializeVariables = () => {
	lines = document.querySelectorAll("hr");
	textSliders = document.querySelectorAll("header .oh > .oh__inner");
	gridContainer = document.querySelector("[data-grid]");
	gridItems = gridContainer ? Array.from(gridContainer.children) : [];
	hasPreloaderComponent = document.querySelector(".loading");
};

// Animate the homepage elements using a GSAP timeline.
const animateHomepageElements = () => {
	if (!gridContainer || !gridItems.length) return;

	// Hide the grid container before starting the animation.
	animationTimeline = gsap.set(gridContainer, { autoAlpha: 0 });

	gsap
		.timeline({
			defaults: {
				duration: 1.4,
				ease: "power4",
			},
			onComplete: () => {
				// Dispatch a custom event after all animations complete.
				const event = new CustomEvent("gridRendered");
				document.dispatchEvent(event);
			},
		})
		.fromTo(
			lines,
			{ transformOrigin: "0% 50%", scaleX: 0 },
			{ duration: 1.6, ease: "power2", stagger: 0.9, scaleX: 1 },
		)
		.from(textSliders, { yPercent: 100, stagger: 0.1 }, 0.2)
		.set(gridContainer, { autoAlpha: 1 }, "<+=1")
		.from(gridItems, { yPercent: 100, stagger: 0.08 }, "<")
		.from(gridItems, { ease: "sine", autoAlpha: 0, stagger: 0.08 }, "<");
};

// Clean up animations and DOM references to prevent memory leaks.
const cleanup = () => {
	if (animationTimeline) {
		animationTimeline.kill(); // Stop the timeline
		animationTimeline = null;
	}
	lines = null;
	textSliders = null;
	gridContainer = null;
	gridItems = null;
	hasPreloaderComponent = null;
};

// Initialize the page: set variables, manage scroll behavior, and trigger animations.
const init = () => {
	initializeVariables();

	// Disable scroll restoration on browser back navigation.
	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}
	// Scroll to the top of the page.
	window.scrollTo(0, 0);

	// Wait for assets to load if a preloader is present.
	if (
		hasPreloaderComponent &&
		sessionStorage.getItem("preloadComplete") !== "true"
	) {
		document.addEventListener("assetsLoaded", animateHomepageElements, {
			once: true,
		});
	} else {
		animateHomepageElements();
	}
};

// Run a callback only if the current page is the home page.
const handlePageEvent = (_, callback) => {
	const page = document.documentElement.getAttribute("data-page");
	if (page === "home") callback();
};

// Astro lifecycle hook: initialize animations on page load.
document.addEventListener("astro:page-load", () => {
	handlePageEvent("page-load", init);
});

// Astro lifecycle hook: clean up before swapping pages.
document.addEventListener("astro:before-swap", () => {
	handlePageEvent("before-swap", cleanup);
});
