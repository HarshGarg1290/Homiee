import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";

// Import modular components
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import EventsSection from "../components/landing/EventsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function Landing() {
	const lenisRef = useRef();

	// Initialize smooth scroll (exactly as in original)
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			direction: "vertical",
			gestureDirection: "vertical",
			smooth: true,
			mouseMultiplier: 1,
			smoothTouch: false,
			touchMultiplier: 2,
			infinite: false,
		});

		lenisRef.current = lenis;

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, []);

	// Custom navbar scroll effect (exactly as in original)
	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollY = window.scrollY;
					const navbar = document.querySelector(".navbar-element");

					if (navbar && scrollY > 50) {
						navbar.style.borderRadius = "0.75rem";
						navbar.style.transform = `scale(0.8)`;
						navbar.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)";
						navbar.style.margin = "0 1rem";
						navbar.style.width = "calc(100% - 2rem)";
					} else if (navbar) {
						navbar.style.borderRadius = "0px";
						navbar.style.transform = `scale(1)`;
						navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
						navbar.style.margin = "0";
						navbar.style.width = "100%";
					}
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Scroll to section function (exactly as in original)
	const scrollToSection = (targetId) => {
		const target = document.getElementById(targetId);
		if (target && lenisRef.current) {
			lenisRef.current.scrollTo(target, {
				offset: -80,
				duration: 1.5,
			});
		}
	};

	return (
		<div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root overflow-x-hidden font-body">
			<Head>
				<title>Homiee - Find Your Place in the City</title>
			</Head>

			{/* Modular Navbar */}
			<Navbar scrollToSection={scrollToSection} />

			{/* Modular Hero Section */}
			<HeroSection />

			{/* Main Content Container */}
			<div className="px-10 lg:px-40 flex flex-1 justify-center py-5">
				<div className="layout-content-container flex flex-col flex-1">
					{/* Modular Sections */}
					<HowItWorksSection />
					<FeaturesSection />
					<EventsSection />
					<CTASection />
				</div>
			</div>

			{/* Modular Footer */}
			<Footer />
		</div>
	);
}
