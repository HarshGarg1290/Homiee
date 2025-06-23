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
import { animate, stagger } from "animejs";

export default function Landing() {
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const lenisRef = useRef();

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

	const scrollToSection = (targetId) => {
		const target = document.getElementById(targetId);
		if (target && lenisRef.current) {
			lenisRef.current.scrollTo(target, {
				offset: -80,
				duration: 1.5,
			});
		}
	};

	useEffect(() => {
		const observerOptions = {
			threshold: 0.1,
			rootMargin: "0px 0px -100px 0px",
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (entry.target.classList.contains("service-card")) {
						animate(entry.target, {
							translateY: [60, 0],
							opacity: [0, 1],
							scale: [0.9, 1],
							ease: "out(3)",
							duration: 800,
							delay: stagger(150),
						});
					} else if (entry.target.classList.contains("community-section")) {
						// Desktop animations
						const desktopImage = entry.target.querySelector(".community-image");
						const desktopContent =
							entry.target.querySelector(".community-content");

						if (desktopImage) {
							animate(desktopImage, {
								translateX: [-100, 0],
								opacity: [0, 1],
								ease: "out(3)",
								duration: 1000,
								delay: 200,
							});
						}

						if (desktopContent) {
							animate(desktopContent, {
								translateX: [100, 0],
								opacity: [0, 1],
								ease: "out(3)",
								duration: 1000,
								delay: 400,
							});
						}
					} else if (entry.target.classList.contains("events-section")) {
						animate(entry.target.querySelector(".events-title"), {
							translateY: [30, 0],
							opacity: [0, 1],
							ease: "out(3)",
							duration: 800,
							delay: 200,
						});
						animate(entry.target.querySelectorAll(".event-card"), {
							translateY: [40, 0],
							opacity: [0, 1],
							scale: [0.95, 1],
							ease: "out(3)",
							duration: 600,
							delay: stagger(150),
						});
					}
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		document.querySelectorAll(".service-card").forEach((card) => {
			observer.observe(card);
		});

		document.querySelectorAll(".community-section").forEach((section) => {
			observer.observe(section);
		});

		document.querySelectorAll(".events-section").forEach((section) => {
			observer.observe(section);
		});

		const buttons = document.querySelectorAll(".animated-button");
		buttons.forEach((button) => {
			button.addEventListener("mouseenter", () => {
				animate(button, {
					scale: 1.05,
					duration: 200,
					ease: "out(4)",
				});
			});

			button.addEventListener("mouseleave", () => {
				animate(button, {
					scale: 1,
					duration: 200,
					ease: "out(4)",
				});
			});
		});

		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollY = window.scrollY;
					const navbar = document.querySelector(".navbar-element");
					if (navbar && scrollY > 50) {
						navbar.style.transform = `scale(0.95)`;
						navbar.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)";
					} else if (navbar) {
						navbar.style.transform = `scale(1)`;
						navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
					}
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", handleScroll);
			buttons.forEach((button) => {
				button.removeEventListener("mouseenter", () => {});
				button.removeEventListener("mouseleave", () => {});
			});
		};
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<Head>
				<title>Homiee - Find Flats & Flatmates</title>
			</Head>

			<nav className="navbar-element fixed top-2 left-1/2 transform -translate-x-1/2 my-2 sm:my-5 w-[90%] rounded-4xl p-[2px] text-center shadow-lg z-50 bg-gradient-to-r from-[#f58b05] to-[#ffc22f] transition-all duration-300">
				<div className="mx-auto px-4 sm:px-6 lg:px-8 rounded-4xl  bg-white">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-3 group cursor-pointer">
							<div className="relative">
								<div className="w-10 h-10 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300  ring-2 ring-white/20 group-hover:ring-white/40">
									<img
										src="/logo.jpg"
										alt="Homiee Logo"
										className="w-10 h-10"
									/>
								</div>
							</div>
							<div className="hidden sm:block">
								<span className="font-bold text-3xl tracking-tight bg-[#f58b05] bg-clip-text text-transparent font-heading">
									Homiee
								</span>
								<div className="text-[#7fbbdd] text-sm font-bold tracking-wide font-body">
									Find Your Tribe
								</div>
							</div>
						</div>

						<div className="hidden lg:flex items-center space-x-1 text-lg">
							<a
								href="#community"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection("community");
								}}
								className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 cursor-pointer"
							>
								<span className="text-[#f58b05] font-medium group-hover:text-[#ffc22f] transition-colors duration-300 font-body">
									Community
								</span>
								<div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
							</a>
							<a
								href="#events"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection("events");
								}}
								className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 cursor-pointer"
							>
								<Calendar className="w-4 h-4 text-white inline mr-2" />
								<span className="text-[#f58b05] font-medium group-hover:text-[#ffc22f] transition-colors duration-300">
									Events
								</span>
								<div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
							</a>
							<a
								href="#finder"
								onClick={(e) => {
									e.preventDefault();
									router.push("/flats");
								}}
								className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 cursor-pointer"
							>
								<Search className="w-4 h-4 text-white inline mr-2" />
								<span className="text-[#f58b05] font-medium group-hover:text-[#ffc22f] transition-colors duration-300">
									Flat Finder
								</span>
								<div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
							</a>
							<a
								href="#about"
								className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
							>
								<Info className="w-4 h-4 text-white inline mr-2" />
								<span className="text-[#f58b05] font-medium group-hover:text-[#ffc22f] transition-colors duration-300">
									About Us
								</span>
								<div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
							</a>
						</div>

						<div className="flex items-center  sm:space-x-3 ">
							<button className=" cursor-pointer relative p-2 text-[#f58b05] group-hover:text-[#ffc22f] transition-colors duration-300 hover:bg-white/10 rounded-lg">
								<Bell className="w-5 h-5" />
								<span className="absolute -top-[0.2px]  w-3 h-3 bg-[#ffc22f] rounded-full animate-bounce"></span>
							</button>

							<button className=" cursor-pointer flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-full hover:bg-white/20 transition-all duration-300 group">
								<div className="w-6 h-6 bg-white rounded-full flex items-center justify-center transition-transform duration-300">
									<User className="w-5 h-5 text-[#f58b05]" />
								</div>
							</button>

							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="lg:hidden p-2 text-[#f58b05] hover:text-[#ffc22f] transition-colors duration-300 hover:bg-white/10 rounded-lg"
							>
								{isMobileMenuOpen ? (
									<X className="w-6 h-6" />
								) : (
									<Menu className="w-6 h-6" />
								)}
							</button>
						</div>
					</div>

					<div
						className={`lg:hidden transition-all duration-300 ease-in-out ${
							isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
						} overflow-hidden`}
					>
						<div className="py-4 space-y-2 border-t border-white/20">
							<a
								href="#community"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection("community");
									setIsMobileMenuOpen(false);
								}}
								className="flex items-center space-x-3 px-4 py-3 text-[#f58b05] hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer"
							>
								<Heart className="w-4 h-4" />
								<span className="font-medium">Community</span>
							</a>
							<a
								href="#events"
								onClick={(e) => {
									e.preventDefault();
									scrollToSection("events");
									setIsMobileMenuOpen(false);
								}}
								className="flex items-center space-x-3 px-4 py-3 text-[#f58b05] hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer"
							>
								<Calendar className="w-4 h-4" />
								<span className="font-medium">Events</span>
							</a>
							<a
								href="#finder"
								className="flex items-center space-x-3 px-4 py-3 text-[#f58b05] hover:bg-white/10 rounded-lg transition-all duration-300"
							>
								<Search className="w-4 h-4" />
								<span className="font-medium">Flat Finder</span>
							</a>
							<a
								href="#about"
								className="flex items-center space-x-3 px-4 py-3 text-[#f58b05] hover:bg-white/10 rounded-lg transition-all duration-300"
							>
								<Info className="w-4 h-4" />
								<span className="font-medium">About Us</span>
							</a>
						</div>
					</div>
				</div>
			</nav>

			<div
				className="relative  min-h-[100vh] flex items-center justify-center overflow-hidden  bg-cover bg-center bg-no-repeat "
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
				}}
			>
				<div className="absolute inset-0 bg-black opacity-40"></div>

				<div className="relative z-10 text-center px-4 max-w-4xl mx-auto ">
					<div className="mb-8">
						<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight font-heading">
							Flatmates That Just
							<br />
							<span className="italic bg-gradient-to-r from-yellow-600 to-orange-300 bg-clip-text text-transparent">
								Click.
							</span>
						</h1>
					</div>
				</div>
			</div>

			<div className="py-20 px-6 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className=" mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-[#f58b05] mb-4 font-heading">
							Our Services
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div
							onClick={() => router.push("/flats")}
							className="service-card group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer opacity-0"
						>
							<div
								className="relative h-64 overflow-hidden bg-cover bg-center bg-no-repeat"
								style={{ backgroundImage: `url('/findflat.png')` }}
							>
								<div className="absolute inset-0 bg-black opacity-40"></div>
								<div className="absolute top-4 right-4">
									<button
										onClick={(e) => {
											e.stopPropagation();
											router.push("/flats");
										}}
										className="animated-button bg-orange-500 text-white p-2 text-center rounded-full duration-300 transform hover:scale-110"
									>
										<svg
											className="w-5 h-5 "
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</button>
								</div>
								<div className="absolute bottom-6 left-6">
									<h3 className="text-white font-bold text-xl mb-2 font-heading">
										Find a flat
									</h3>
									<p className="text-blue-100 text-sm font-body">
										Lorem ipsum is dummy text
									</p>
								</div>
							</div>
						</div>

						<div
							onClick={() => router.push("/flatmates")}
							className="service-card group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer opacity-0"
						>
							<div
								className="relative h-64 overflow-hidden bg-cover bg-center bg-no-repeat"
								style={{ backgroundImage: `url('/findflatmate.png')` }}
							>
								<div className="absolute inset-0 bg-black opacity-40"></div>
								<div className="absolute top-4 right-4">
									<button
										onClick={(e) => {
											e.stopPropagation();
											router.push("/flatmates");
										}}
										className="bg-orange-500 text-white p-2 rounded-full  duration-300 transform hover:scale-110"
									>
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</button>
								</div>
								<div className="absolute bottom-6 left-6">
									<h3 className="text-white font-bold text-xl mb-2 font-heading">
										Find a flatmate
									</h3>
									<p className="text-purple-100 text-sm font-body">
										Lorem ipsum is dummy text
									</p>
								</div>
							</div>
						</div>

						<div className="service-card group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 opacity-0">
							<div
								className="relative h-64 overflow-hidden bg-cover bg-center bg-no-repeat"
								style={{ backgroundImage: `url('/findreplacement.png')` }}
							>
								<div className="absolute inset-0 bg-black opacity-40"></div>
								<div className="absolute top-4 right-4">
									<button className="bg-orange-500 text-white p-2 rounded-full  duration-300 transform hover:scale-110">
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</button>
								</div>
								<div className="absolute bottom-6 left-6">
									<h3 className="text-white font-bold text-xl mb-2 font-heading">
										Find a replacement
									</h3>
									<p className="text-green-100 text-sm font-body">
										Lorem ipsum is dummy text
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div id="community" className="community-section relative py-10 px-6">
				<div className="hidden md:flex max-w-7xl mx-auto items-center">
					<div className="community-image bg-[#c4e9f2] w-[50%] h-auto object-fill rounded-sm shadow-lg opacity-0">
						<img src="/tribe.png" alt="People Toasting" className="p-10" />
					</div>

					<div className="community-content w-[50%] pl-12 text-end opacity-0">
						<h2 className="text-4xl md:text-5xl font-bold text-[#f58b05] mb-4 font-heading">
							Find Your <span className="italic">Tribe</span>
						</h2>

						<p className="text-lg text-gray-700 mb-8 max-w-2xl ml-auto font-body">
							View events and communities around the city to match your vibe!
						</p>

						<button className="animated-button bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors font-body">
							View More
						</button>
					</div>
				</div>

				<div className="md:hidden relative min-h-[500px] rounded-lg overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
						style={{ backgroundImage: `url('/tribe.png')` }}
					></div>
					<div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white/70"></div>

					<div className="relative z-10 flex flex-col justify-center items-center h-full px-6 py-16 text-center">
						<div className="community-content opacity-0">
							<h2 className="text-4xl font-bold text-[#f58b05] mb-6 font-heading">
								Find Your <span className="italic">Tribe</span>
							</h2>

							<p className="text-lg text-gray-800 mb-8 max-w-md mx-auto font-medium font-body">
								View events and communities around the city to match your vibe!
							</p>

							<button className="animated-button bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-lg font-body">
								View More
							</button>
						</div>
					</div>
				</div>
			</div>
			<div id="events" className="events-section py-16 px-6 bg-white">
				<div className="max-w-7xl mx-auto">
					<h2 className="events-title text-4xl md:text-5xl text-[#f58b05] font-bold text-center mb-12 opacity-0 font-heading">
						Around The City
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						<div
							className="event-card relative rounded-lg overflow-hidden h-64 bg-cover bg-center bg-no-repeat group cursor-pointer opacity-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
							style={{ backgroundImage: `url('/gym.png')` }}
						>
							<div className="absolute inset-0 bg-black opacity-40"></div>
							<div className="absolute bottom-4 left-4">
								<h3 className="text-white font-semibold text-lg font-heading">
									Gym near you
								</h3>
							</div>
						</div>

						<div
							className="event-card relative rounded-lg overflow-hidden h-64 bg-cover bg-center bg-no-repeat group cursor-pointer opacity-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
							style={{ backgroundImage: `url('/concert.png')` }}
						>
							<div className="absolute inset-0 bg-black opacity-40"></div>
							<div className="absolute bottom-4 left-4">
								<h3 className="text-white font-semibold text-lg font-heading">
									Concerts near you
								</h3>
							</div>
						</div>

						<div
							className="event-card relative rounded-lg overflow-hidden h-64 bg-cover bg-center bg-no-repeat group cursor-pointer opacity-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
							style={{ backgroundImage: `url('/club.png')` }}
						>
							<div className="absolute inset-0 bg-black opacity-40"></div>
							<div className="absolute bottom-4 left-4">
								<h3 className="text-white font-semibold text-lg font-heading">
									Clubs near you
								</h3>
							</div>
						</div>

						<div
							className="event-card relative rounded-lg overflow-hidden h-64 group cursor-pointer bg-cover bg-center bg-no-repeat opacity-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
							style={{ backgroundImage: `url('/hero.png')` }}
						>
							<div className="absolute inset-0 bg-black opacity-40"></div>
							<div className="absolute bottom-4 left-4">
								<h3 className="text-white font-semibold text-lg font-heading">
									Activities near you
								</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
