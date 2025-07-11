import Head from "next/head";
import { useRouter } from "next/router";
import {
	User,
	Menu,
	X,
	Calendar,
	Search,
	Info,
	Heart,
	Bell,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, useAnimation, useInView } from "framer-motion";

export default function Landing() {
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const lenisRef = useRef();

	const fadeInUp = {
		hidden: { opacity: 0, y: 60 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
		},
	};

	const fadeInLeft = {
		hidden: { opacity: 0, x: -60 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
		},
	};

	const fadeInRight = {
		hidden: { opacity: 0, x: 60 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
		},
	};

	const staggerContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	};

	const textReveal = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	};

	const scaleIn = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	};

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

	// Custom navbar scroll effect
	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollY = window.scrollY;
					const navbar = document.querySelector(".navbar-element");

					if (navbar && scrollY > 50) {
						navbar.style.borderRadius = "0.75rem"; // equivalent to rounded-xl
						navbar.style.transform = `scale(0.8)`;
						navbar.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)";
						navbar.style.margin = "0 1rem";
						navbar.style.width = "calc(100% - 2rem)";
					} else if (navbar) {
						navbar.style.borderRadius = "0px"; // reset to no border radius
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

			{/* Enhanced Navbar with Motion */}
			<motion.nav
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="navbar-element flex items-center justify-between whitespace-nowrap bg-white/85 backdrop-blur-xl border-b border-white/20 px-6 lg:px-12 py-5 fixed w-full top-0 z-50 transition-all duration-500 shadow-lg shadow-black/5"
			>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="flex items-center gap-4 text-[#1c150d]"
				>
					<div className="relative group">
						<div className="absolute inset-0 bg-gradient-to-r from-[#f38406]/20 to-[#e07405]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<motion.img
							transition={{ duration: 0.3 }}
							src="/logo.jpg"
							alt="Homiee Logo"
							className="relative w-12 h-12 rounded-md transition-all duration-300 "
						/>
					</div>
					<motion.h2
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-[#1c150d] text-2xl font-bold leading-tight tracking-[-0.02em] font-heading bg-gradient-to-r from-[#1c150d] to-[#3a3a3a] bg-clip-text"
					>
						Homiee
					</motion.h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="hidden lg:flex flex-1 justify-center"
				>
					<div className="flex items-center gap-2 px-3 py-2">
						{[
							{
								href: "#community",
								text: "Find Your Tribe",
								action: () => scrollToSection("community"),
							},
							{
								href: "#flatmates",
								text: "Find Flatmates",
								action: () => router.push("/flatmates"),
							},
							{
								href: "#flats",
								text: "Find Flats",
								action: () => router.push("/flats"),
							},
							{
								href: "#events",
								text: "Community",
								action: () => scrollToSection("events"),
							},
						].map((item, index) => (
							<motion.a
								key={item.text}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								href={item.href}
								onClick={(e) => {
									e.preventDefault();
									item.action();
								}}
								className="text-[#1c150d] text-sm font-medium leading-normal hover:text-[#f38406] transition-all duration-300 cursor-pointer font-body relative group px-4 py-2.5 rounded-full hover:bg-white/80 hover:shadow-sm"
							>
								{item.text}
								<span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#f38406] to-[#e07405] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
							</motion.a>
						))}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="hidden lg:flex items-center gap-3"
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => router.push("/flatmates")}
						className="text-[#1c150d] text-sm font-medium leading-normal hover:text-[#f38406] transition-all duration-300 cursor-pointer font-body px-5 py-2.5 rounded-full hover:bg-white/60 border border-transparent hover:border-white/40 backdrop-blur-sm"
					>
						Sign In
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => router.push("/flats")}
						className=" flex min-w-[130px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-7 bg-gradient-to-r from-[#f38406] via-[#e07405] to-[#d06304] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:from-[#e07405] hover:via-[#d06304] hover:to-[#c05503] transition-all duration-300 font-body shadow-lg hover:shadow-xl relative group"
					>
						<span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
						<span className="relative ">Get Started</span>
					</motion.button>
				</motion.div>

				{/* Mobile Menu Button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="lg:hidden p-3 text-[#1c150d] hover:text-[#f38406] transition-all duration-300 rounded-full hover:bg-white/60 border border-transparent hover:border-white/40 backdrop-blur-sm shadow-sm hover:shadow-md"
				>
					{isMobileMenuOpen ? (
						<X className="w-6 h-6" />
					) : (
						<Menu className="w-6 h-6" />
					)}
				</motion.button>

				{/* Enhanced Mobile Menu */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{
						opacity: isMobileMenuOpen ? 1 : 0,
						y: isMobileMenuOpen ? 0 : -20,
						visibility: isMobileMenuOpen ? "visible" : "hidden",
					}}
					transition={{ duration: 0.3 }}
					className="lg:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg"
				>
					<div className="px-8 py-6 space-y-4">
						{[
							{
								href: "#community",
								text: "Find Your Tribe",
								action: () => scrollToSection("community"),
							},
							{
								href: "#flatmates",
								text: "Find Flatmates",
								action: () => router.push("/flatmates"),
							},
							{
								href: "#flats",
								text: "Find Flats",
								action: () => router.push("/flats"),
							},
							{
								href: "#events",
								text: "Community",
								action: () => scrollToSection("events"),
							},
						].map((item, index) => (
							<motion.a
								key={item.text}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: 0.1 * index }}
								href={item.href}
								onClick={(e) => {
									e.preventDefault();
									item.action();
									setIsMobileMenuOpen(false);
								}}
								className="block text-[#1c150d] text-sm font-medium leading-normal hover:text-[#f38406] transition-all duration-300 cursor-pointer font-body py-3 px-4 rounded-lg hover:bg-white/60 relative group"
							>
								{item.text}
								<span className="absolute bottom-2 left-4 w-0 h-0.5 bg-gradient-to-r from-[#f38406] to-[#e07405] transition-all duration-300 group-hover:w-24 rounded-full"></span>
							</motion.a>
						))}
					</div>
				</motion.div>
			</motion.nav>

			{/* Enhanced Hero Section */}
			<div className="px-10 lg:px-40 flex flex-1 justify-center py-5 pt-20">
				<div className="layout-content-container flex flex-col flex-1">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
						className="@container"
					>
						<div className="@[480px]:p-4">
							<div
								className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
								style={{
									backgroundImage:
										'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80")',
								}}
							>
								<motion.div
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 0.8 }}
									className="flex flex-col gap-2 text-left"
								>
									<motion.h1
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 1 }}
										className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] font-heading"
									>
										Find Your Place in the City
									</motion.h1>
									<motion.h2
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 1.2 }}
										className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal font-body"
									>
										Homiee connects you with like-minded people and helps you
										discover the best of your new city. Find flatmates, flats,
										and local insights, all in one place.
									</motion.h2>
								</motion.div>
								<motion.button
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 1.4 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => router.push("/flats")}
									className="animated-button flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f38406] text-[#1c150d] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#e07405] transition-colors font-body"
								>
									<span className="truncate">Get Started</span>
								</motion.button>
							</div>
						</div>
					</motion.div>

					{/* Enhanced How Homiee Works Section */}
					<HowItWorksSection />

					{/* Enhanced Features Section */}
					<FeaturesSection />

					{/* Enhanced Events Section */}
					<EventsSection />

					{/* Enhanced CTA Section */}
					<CTASection />
				</div>
			</div>

			{/* Enhanced Footer */}
			<motion.footer
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				className="flex justify-center bg-[#fcfaf8] border-t border-[#f4eee6]"
			>
				<div className="flex max-w-[960px] flex-1 flex-col">
					<footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around"
						>
							{["About", "Contact", "Terms of Service", "Privacy Policy"].map(
								(item, index) => (
									<motion.a
										key={item}
										initial={{ opacity: 0, y: 10 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: 0.1 * index }}
										viewport={{ once: true }}
										whileHover={{ scale: 1.05 }}
										className="text-[#9e7647] text-base font-normal leading-normal min-w-40 hover:text-[#f38406] transition-colors font-body"
										href="#"
									>
										{item}
									</motion.a>
								)
							)}
						</motion.div>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
							className="text-[#9e7647] text-base font-normal leading-normal font-body"
						>
							© 2024 Homiee. All rights reserved.
						</motion.p>
					</footer>
				</div>
			</motion.footer>
		</div>
	);
}

// Enhanced How It Works Section Component
function HowItWorksSection() {
	const { ref, controls } = useScrollAnimation();

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={staggerContainer}
			className="flex flex-col gap-10 px-4 py-10 @container"
		>
			<motion.div variants={fadeInUp} className="flex flex-col gap-4">
				<motion.h1
					variants={textReveal}
					className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-heading"
				>
					How Homiee Works
				</motion.h1>
				<motion.p
					variants={textReveal}
					className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body"
				>
					Our platform uses intelligent matching to connect you with flatmates
					and flats that fit your lifestyle and preferences. We also provide
					curated local insights to help you explore your neighborhood and build
					meaningful connections in your city.
				</motion.p>
			</motion.div>
			<motion.div
				variants={staggerContainer}
				className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6"
			>
				{[
					{
						image: "/findflatmate.png",
						title: "Connect with Like-Minded People",
						description:
							"Our intelligent matching system connects you with potential flatmates who share your interests, values, and lifestyle preferences.",
						action: () => router.push("/flatmates"),
					},
					{
						image: "/findflat.png",
						title: "Find Your Ideal Home",
						description:
							"Discover flats that match your budget, location preferences, and lifestyle, ensuring a perfect fit for your new chapter.",
						action: () => router.push("/flats"),
					},
					{
						image: "/tribe.png",
						title: "Build Your Community",
						description:
							"Get personalized recommendations for local events, communities, and hidden gems, making your city feel like home.",
						action: () => {},
					},
				].map((item, index) => (
					<motion.div
						key={item.title}
						whileHover={{ y: -8 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						onClick={item.action}
						className="service-card flex flex-col gap-3 pb-3 cursor-pointer group  transition-shadow duration-300"
					>
						<div
							className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl overflow-hidden transition-transform duration-300 group-hover:brightness-110"
							style={{ backgroundImage: `url("${item.image}")` }}
						></div>
						<div>
							<p className="text-[#1c150d] text-base font-medium leading-normal font-heading group-hover:text-[#f38406] transition-colors duration-300">
								{item.title}
							</p>
							<p className="text-[#9e7647] text-sm font-normal leading-normal font-body">
								{item.description}
							</p>
						</div>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
}

// Enhanced Features Section Component
function FeaturesSection() {
	const { ref, controls } = useScrollAnimation();

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={staggerContainer}
			className="flex flex-col gap-10 px-4 py-10 @container"
		>
			<motion.div className="flex flex-col gap-4">
				<motion.h1
					variants={textReveal}
					className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-heading"
				>
					Why Choose Homiee?
				</motion.h1>
				<motion.p
					variants={textReveal}
					className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body"
				>
					We understand that finding the right people to live with is more
					important than just finding a place. That's why we've built a platform
					that prioritizes compatibility and community.
				</motion.p>
			</motion.div>
			<motion.div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
				{[
					{
						icon: <User className="w-6 h-6" />,
						title: "Tribe-Based Matching",
						description:
							"Find your tribe first, then find a home together. Our algorithm matches you with people who share your lifestyle, interests, and values.",
					},
					{
						icon: <Search className="w-6 h-6" />,
						title: "Smart Flat Discovery",
						description:
							"Once you've found your tribe, discover flats together that meet everyone's criteria, budget, and location preferences.",
					},
					{
						icon: <Heart className="w-6 h-6" />,
						title: "Local Community Integration",
						description:
							"Discover local events, communities, and activities that match your interests. Turn your new city into your second home.",
					},
				].map((item, index) => (
					<motion.div
						key={item.title}
						whileHover={{ y: -6 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className="flex flex-1 gap-3 rounded-lg border border-[#e9dcce] bg-[#fcfaf8] p-6 flex-col transition-all duration-300 hover:shadow-lg hover:border-[#f38406]/20 cursor-pointer group"
					>
						<div className="text-[#f38406] transition-transform duration-300 ">
							{item.icon}
						</div>
						<div className="flex flex-col gap-2">
							<h2 className="text-[#1c150d] text-lg font-bold leading-tight font-heading group-hover:text-[#f38406] transition-colors duration-300">
								{item.title}
							</h2>
							<p className="text-[#9e7647] text-sm font-normal leading-normal font-body">
								{item.description}
							</p>
						</div>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
}

// Enhanced Events Section Component
function EventsSection() {
	const { ref, controls } = useScrollAnimation();

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={staggerContainer}
			id="events"
			className="events-section flex flex-col gap-10 px-4 py-10 @container"
		>
			<motion.div variants={fadeInUp} className="flex flex-col gap-4">
				<motion.h1
					variants={textReveal}
					className="events-title text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-heading"
				>
					Around The City
				</motion.h1>
				<motion.p
					variants={textReveal}
					className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body"
				>
					Explore what your city has to offer and connect with communities that
					share your interests.
				</motion.p>
			</motion.div>
			<motion.div
				variants={staggerContainer}
				className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
			>
				{[
					{ image: "/gym.png", title: "Fitness & Wellness" },
					{ image: "/concert.png", title: "Music & Arts" },
					{ image: "/club.png", title: "Nightlife & Social" },
					{ image: "/hero.png", title: "Local Activities" },
				].map((item, index) => (
					<motion.div
						key={item.title}
						whileHover={{ y: -8 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className="event-card relative rounded-lg overflow-hidden h-64 bg-cover bg-center bg-no-repeat group cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:brightness-110"
						style={{ backgroundImage: `url('${item.image}')` }}
					>
						<div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity duration-300"></div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="absolute bottom-4 left-4"
						>
							<h3 className="text-white font-semibold text-lg font-heading">
								{item.title}
							</h3>
						</motion.div>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
}

// Enhanced CTA Section Component
function CTASection() {
	const { ref, controls } = useScrollAnimation();

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={fadeInUp}
			className="@container"
		>
			<div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
				<motion.div
					variants={textReveal}
					className="flex flex-col gap-2 text-center"
				>
					<motion.h1
						variants={textReveal}
						className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-heading"
					>
						Ready to Find Your Tribe?
					</motion.h1>
					<motion.p
						variants={textReveal}
						className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body"
					>
						Join thousands of people who have found their perfect flatmates and
						discovered their new home through Homiee. Your tribe is waiting for
						you.
					</motion.p>
				</motion.div>
				<motion.div variants={scaleIn} className="flex flex-1 justify-center">
					<div className="flex justify-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => router.push("/flats")}
							className="animated-button flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f38406] text-[#1c150d] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#e07405] transition-colors font-body grow"
						>
							<span className="truncate">Start Your Journey</span>
						</motion.button>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}

const useScrollAnimation = () => {
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

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const fadeInUp = {
	hidden: { opacity: 0, y: 60 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
	},
};

const textReveal = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const scaleIn = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};
