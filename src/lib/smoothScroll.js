import { useEffect, useRef, useCallback } from "react";
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

	// Optimized navbar scroll effect
	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollY = window.scrollY;
					const navbar = document.querySelector(".navbar-element");

					if (navbar) {
						const isScrolled = scrollY > 50;
						navbar.style.borderRadius = isScrolled ? "0.75rem" : "0px";
						navbar.style.transform = isScrolled ? "scale(0.95)" : "scale(1)";
						navbar.style.boxShadow = isScrolled 
							? "0 10px 40px rgba(0,0,0,0.15)" 
							: "0 5px 20px rgba(0,0,0,0.1)";
						navbar.style.margin = isScrolled ? "0 1rem" : "0";
						navbar.style.width = isScrolled ? "calc(100% - 2rem)" : "100%";
					}
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Scroll to section function
	const scrollToSection = useCallback((targetId) => {
		const target = document.getElementById(targetId);
		if (target && lenisRef.current) {
			lenisRef.current.scrollTo(target, {
				offset: -80,
				duration: 1.5,
			});
		}
	}, []);

	return { scrollToSection };
};
