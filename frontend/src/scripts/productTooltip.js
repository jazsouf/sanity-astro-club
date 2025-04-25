import gsap from "gsap";

class Tooltip {
	constructor(gridEl) {
		this.grid = gridEl;
		this.products = this.grid.children;
		if (this.products.length === 0) return;
		this.tooltip = document.querySelector(".tooltip");
		this.OFFSET_X = 20; // Distance from cursor to left edge of tooltip
		this.OFFSET_Y = -60; // Distance from cursor to top edge of tooltip
		this.animationConfig = {
			// Configuration for the text animations (e.g., rows sliding in/out)
			texts: {
				duration: 0.7,
				ease: "expo",
			},
			// Configuration for the tooltip's scaling animations
			tooltip: {
				duration: 0.6,
				ease: "power4.inOut",
			},
			// Delay before starting text animations when showing the tooltip
			textsDelay: 0.4, // Delay in seconds before the text animations start
			// Overlap delay for hiding the tooltip and text animations
			hideDelay: "-=0.7", // Overlaps the tooltip's scale-down with text sliding animations
		};
		// Animation directions for the rows
		this.rowAnimationDirections = {
			productTitle: { in: { yPercent: -100 }, out: { yPercent: -100 } }, // In and out to/from the top
			creatorName: { in: { yPercent: 100 }, out: { yPercent: 100 } }, // In and out to/from the bottom
			price: { in: { yPercent: 100 }, out: { yPercent: 100 } }, // In and out to/from the bottom
		};
		this.hoverTarget = null; // Tracks the currently hovered `.product`
		this.isTooltipVisible = false; // Tracks tooltip visibility
		this.scaleDownTimeout; // Tracks the scale-down timeout
		this.scaleDownTimeline; // Stores the tooltip scale-down timeline
		this.mouseLeaveTimeout; // Timeout for mouseleave handling
		this.rowTimelines = {}; // Stores timelines for each row
		this.windowWidth = window.innerWidth; // Cache window width

		// Define smooth animations for moving the tooltip
		// xTo and yTo control the tooltip's horizontal (x) and vertical (y) positions
		// Using GSAP's quickTo for better performance
		this.xTo = gsap.quickTo(this.tooltip, "x", { duration: 0.6, ease: "expo" });
		this.yTo = gsap.quickTo(this.tooltip, "y", { duration: 0.6, ease: "expo" });

		// Initialize row active states
		for (const row of this.tooltip.querySelectorAll(".tooltip__row")) {
			row.dataset.active = "0";
		}

		this.initializeEvents();
	}

	initializeEvents() {
		this.grid.addEventListener("mousemove", this.handleMouseMove);
		window.addEventListener("resize", this.handleResize);

		for (const product of [...this.products]) {
			product.addEventListener("mouseenter", this.handleMouseEnter);
			product.addEventListener("mouseleave", this.handleMouseLeave);
		}
	}

	handleMouseMove = (e) => {
		if (!this.hoverTarget) return;

		const tooltipWidth = this.tooltip.offsetWidth;
		let tooltipX;
		const tooltipY = e.clientY + this.OFFSET_Y + window.scrollY;

		if (e.clientX + this.OFFSET_X + tooltipWidth > this.windowWidth) {
			tooltipX = e.clientX - this.OFFSET_X - tooltipWidth + window.scrollX;
		} else {
			tooltipX = e.clientX + this.OFFSET_X + window.scrollX;
		}

		if (!this.isTooltipVisible) {
			if (this.scaleDownTimeline) this.scaleDownTimeline.kill();
			clearTimeout(this.scaleDownTimeout);

			gsap.set(this.tooltip, { x: tooltipX, y: tooltipY });
			gsap.fromTo(
				this.tooltip,
				{ scale: 0, opacity: 1, transformOrigin: "0% 100%" },
				{ ...this.animationConfig.tooltip, scale: 1 },
			);

			this.isTooltipVisible = true;
		} else {
			this.xTo(tooltipX);
			this.yTo(tooltipY);
		}

		clearTimeout(this.scaleDownTimeout);
		this.scaleDownTimeout = setTimeout(() => {
			if (!this.hoverTarget) {
				this.scaleDownTimeline = gsap.timeline();
				this.updateTooltip(
					{ productTitle: "", creatorName: "", price: "" },
					this.scaleDownTimeline,
					"out",
				);
				this.scaleDownTimeline.to(
					this.tooltip,
					{ ...this.animationConfig.tooltip, scale: 0 },
					this.animationConfig.hideDelay,
				);
				this.isTooltipVisible = false;
			}
		}, 50);
	};

	handleMouseEnter = (e) => {
		clearTimeout(this.mouseLeaveTimeout);
		this.hoverTarget = e.currentTarget;

		if (this.scaleDownTimeline) this.scaleDownTimeline.kill();
		clearTimeout(this.scaleDownTimeout);

		const productTitle = this.hoverTarget.dataset.productTitle;
		const creatorName = this.hoverTarget.dataset.creatorName;
		const price = this.hoverTarget.dataset.price;

		const updateTimeline = gsap.timeline();
		this.updateTooltip(
			{ productTitle, creatorName, price },
			updateTimeline,
			this.isTooltipVisible ? "none" : "in",
		);
	};

	handleMouseLeave = () => {
		this.hoverTarget = null;

		this.mouseLeaveTimeout = setTimeout(() => {
			if (!this.hoverTarget && this.isTooltipVisible) {
				gsap.set(this.tooltip, { scale: 0, opacity: 0 });
				this.isTooltipVisible = false;
			}
		}, 50);
	};

	handleResize = () => {
		this.windowWidth = window.innerWidth;
	};

	destroy() {
		if (this.scaleDownTimeline) this.scaleDownTimeline.kill();
		for (const timeline of Object.values(this.rowTimelines)) {
			timeline?.kill();
		}

		clearTimeout(this.scaleDownTimeout);
		clearTimeout(this.mouseLeaveTimeout);

		this.grid.removeEventListener("mousemove", this.handleMouseMove);
		window.removeEventListener("resize", this.handleResize);

		for (const product of [...this.products]) {
			product.removeEventListener("mouseenter", this.handleMouseEnter);
			product.removeEventListener("mouseleave", this.handleMouseLeave);
		}
	}

	// Function to update all rows dynamically
	updateTooltip(values, timeline, direction) {
		for (const [field, newValue] of Object.entries(values)) {
			const rowSelector = `[data-field="${field}"]`;
			this.updateTextSlider(rowSelector, newValue, timeline, direction);
		}
	}

	// Function to update a single row with sliding animation and add to a timeline
	updateTextSlider(rowSelector, newValue, timeline, direction) {
		const row = this.tooltip.querySelector(rowSelector);
		const textSliders = row.querySelectorAll(".oh__inner");

		if (textSliders.length < 2) return; // No animations needed

		const activeIndex = row.dataset.active === "0" ? 0 : 1;
		const inactiveIndex = activeIndex === 0 ? 1 : 0;

		const currentSlider = textSliders[activeIndex];
		const nextSlider = textSliders[inactiveIndex];

		// Determine animation direction
		const rowField = rowSelector.replace('[data-field="', "").replace('"]', "");
		const animationDirection =
			this.rowAnimationDirections[rowField] ||
			this.rowAnimationDirections.creatorName;

		// Clone animation directions to prevent GSAP mutation
		const clonedOutDirection = { ...animationDirection.out };
		const clonedInDirection = { ...animationDirection.in };

		// Kill and reset existing row animation
		if (this.rowTimelines[rowSelector] && direction !== "out") {
			this.rowTimelines[rowSelector].kill();
		}
		this.rowTimelines[rowSelector] = gsap.timeline();

		if (direction === "in") {
			// Reset both sliders to their "out" positions
			gsap.set(currentSlider, clonedOutDirection);
			gsap.set(nextSlider, clonedInDirection); // Ensure the next slider is positioned off-screen for the next animation

			// Slide the current text out (tooltip appearing)
			this.rowTimelines[rowSelector].to(
				currentSlider,
				{
					...this.animationConfig.texts,
					...clonedOutDirection, // Slide out to the correct direction
				},
				this.animationConfig.textsDelay,
			);

			// Slide the next text in
			gsap.set(nextSlider, clonedInDirection); // Position off-screen
			this.rowTimelines[rowSelector].to(
				nextSlider,
				{
					...this.animationConfig.texts,
					yPercent: 0, // Slide into place
					onStart: () => {
						nextSlider.textContent = newValue; // Update content
					},
				},
				this.animationConfig.textsDelay,
			); // Start after delay
		} else if (direction === "none") {
			// Transition between images
			const transitionOutDirection = {
				productTitle: { yPercent: 100 }, // Slide down for productTitle
				creatorName: { yPercent: -100 }, // Slide up for creatorName
				price: { yPercent: -100 }, // Slide up for price
			}[rowField] || { yPercent: 0 };

			this.rowTimelines[rowSelector].to(
				currentSlider,
				{
					...this.animationConfig.texts,
					...transitionOutDirection, // Correct "out" animation for transitions
				},
				0,
			);

			// Slide the next text in
			gsap.set(nextSlider, clonedInDirection); // Position off-screen
			this.rowTimelines[rowSelector].to(
				nextSlider,
				{
					...this.animationConfig.texts,
					yPercent: 0, // Slide into place
					onStart: () => {
						nextSlider.textContent = newValue; // Update content
					},
				},
				0,
			); // Start simultaneously
		} else if (direction === "out") {
			// Tooltip disappearing
			this.rowTimelines[rowSelector].to(
				currentSlider,
				{
					...clonedOutDirection, // Slide out to the correct direction
					...this.animationConfig.texts,
				},
				0,
			);
		}

		// Update active state for the row
		row.dataset.active = inactiveIndex.toString();

		// Add row animations to the main timeline
		timeline.add(this.rowTimelines[rowSelector], 0);
	}
}

let tooltip;

// Page event handler
const handlePageEvent = (type) => {
	const page = document.documentElement.getAttribute("data-page");
	if (page !== "home") return;

	if (type === "load") {
		tooltip = new Tooltip(document.querySelector("[data-grid]"));
	} else if (type === "before-swap") {
		tooltip.destroy();
	}
};

// Listen for Astro's lifecycle events
document.addEventListener("astro:page-load", () => handlePageEvent("load"));
document.addEventListener("astro:before-swap", () =>
	handlePageEvent("before-swap"),
);
