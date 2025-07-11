import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = ({ scrollToSection }) => {
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navigationItems = [
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
	];

	return (
		<motion.nav
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="navbar-element flex items-center justify-between whitespace-nowrap bg-white/85 backdrop-blur-xl border-b border-white/20 px-6 lg:px-12 py-5 fixed w-full top-0 z-50 transition-all duration-500 shadow-lg shadow-black/5"
		>
			{/* Logo Section */}
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
						className="relative w-12 h-12 rounded-md transition-all duration-300"
					/>
				</div>
				<motion.h2
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="text-[#1c150d] text-2xl font-bold leading-tight tracking-[-0.02em] font-heading"
				>
					Homiee
				</motion.h2>
			</motion.div>

			{/* Desktop Navigation */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="hidden lg:flex flex-1 justify-center"
			>
				<div className="flex items-center gap-2 px-3 py-2">
					{navigationItems.map((item, index) => (
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

			{/* Desktop Action Buttons */}
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
					className="flex min-w-[130px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-7 bg-gradient-to-r from-[#f38406] via-[#e07405] to-[#d06304] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:from-[#e07405] hover:via-[#d06304] hover:to-[#c05503] transition-all duration-300 font-body shadow-lg hover:shadow-xl relative group"
				>
					<span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
					<span className="relative">Get Started</span>
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

			{/* Mobile Menu */}
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
					{navigationItems.map((item, index) => (
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
	);
};

export default Navbar;
