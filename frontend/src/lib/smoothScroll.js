import { useEffect, useRef, useCallback, useState } from "react";
import { useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import Lenis from "lenis";
export const useSmoothScroll = () => {
	const lenisRef = useRef();
	// Initialize Lenis smooth scroll
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smooth: true,
			mouseMultiplier: 1,
			touchMultiplier: 2,
		});
		lenisRef.current = lenis;
		const raf = (time) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);
		return () => lenis.destroy();
	}, []);
	// Scroll-to-section function
	const scrollToSection = useCallback((targetId) => {
		const target = document.getElementById(targetId);
		if (target && lenisRef.current) {
			lenisRef.current.scrollTo(target, {
				offset: -80,
				duration: 1.5,
			});
		}
	}, []);
	return { scrollToSection, lenisRef };
};
/**
 * Custom hook for scroll-triggered animations
 */
export const useScrollAnimation = () => {
	const controls = useAnimation();
	const ref = useRef(null);
	const inView = useInView(ref, {
		threshold: 0.1,
		triggerOnce: true
	});
	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);
	return { ref, controls };
};
/**
 * Custom hook for scroll position tracking with navbar effects
 */
export const useScrollPosition = () => {
	const [scrollY, setScrollY] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const currentScrollY = window.scrollY;
					setScrollY(currentScrollY);
					setIsScrolled(currentScrollY > 50);
					// Apply navbar scroll effect
					const navbar = document.querySelector(".navbar-element");
					if (navbar) {
						if (currentScrollY > 50) {
							navbar.style.borderRadius = "0.75rem";
							navbar.style.transform = "scale(0.9)";
							navbar.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)";
							navbar.style.margin = "0 1rem";
							navbar.style.width = "calc(100% - 2rem)";
						} else {
							navbar.style.borderRadius = "0px";
							navbar.style.transform = "scale(1)";
							navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
							navbar.style.margin = "0";
							navbar.style.width = "100%";
						}
					}
					ticking = false;
				});
				ticking = true;
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return { scrollY, isScrolled };
};

/**
 * Simple scroll utility functions
 */

/**
 * Smoothly scrolls to the top of the page with a slight delay for better UX
 * @param {number} delay - Delay in milliseconds before scrolling (default: 100)
 */
export const scrollToTop = (delay = 100) => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, delay);
};

/**
 * Smoothly scrolls to a specific element by ID
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} delay - Delay in milliseconds before scrolling (default: 100)
 * @param {number} offset - Offset from the top in pixels (default: 0)
 */
export const scrollToElement = (elementId, delay = 100, offset = 0) => {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, delay);
};

/**
 * Smoothly scrolls to a specific position on the page
 * @param {number} position - The Y position to scroll to
 * @param {number} delay - Delay in milliseconds before scrolling (default: 100)
 */
export const scrollToPosition = (position, delay = 100) => {
  setTimeout(() => {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }, delay);
};