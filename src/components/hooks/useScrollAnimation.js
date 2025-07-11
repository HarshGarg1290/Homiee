import { useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for scroll-triggered animations - simplified version matching original
 * @returns {Object} - Returns ref and animation controls
 */
export const useScrollAnimation = () => {
	const controls = useAnimation();
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-100px" });

	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	return { ref, controls };
};


export const useNavbarScroll = () => {
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
 * Custom hook for smooth scroll functionality
 * @param {Object} lenisRef - Reference to Lenis instance
 * @returns {Function} - Scroll to section function
 */
export const useSmoothScroll = (lenisRef) => {
	const scrollToSection = (targetId) => {
		const target = document.getElementById(targetId);
		if (target && lenisRef.current) {
			lenisRef.current.scrollTo(target, {
				offset: -80,
				duration: 1.5,
			});
		}
	};

	return scrollToSection;
};
