import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useModal } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar({ scrollToSection }) {
	const router = useRouter();
	const { openLogin } = useModal();
	const { user, isAuthenticated, logout, isLoading } = useAuth();
	const [showDropdown, setShowDropdown] = useState(false);

	const handleLogout = () => {
		logout();
		setShowDropdown(false);
	};

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
						onClick={() => {router.push('/')}}
						src="/logo.jpg"
						alt="Homiee Logo"
						className="relative w-8 h-8 rounded-md transition-all duration-300 cursor-pointer"
					/>
				</div>
				<motion.h2
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					onClick={() => router.push("/")}
					className="text-[#1c150d] text-2xl font-bold leading-tight tracking-[-0.02em] font-heading bg-gradient-to-r from-[#1c150d] to-[#3a3a3a] bg-clip-text cursor-pointer"
				>
					Homiee
				</motion.h2>
			</motion.div>

			{/* Center Section - How it works */}
			
			
			{/* Right Section - Auth Buttons */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="flex items-center gap-3"
			>
				<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="flex flex-1 justify-center"
			>
				<motion.button
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => scrollToSection("how-it-works")}
					className="text-[#1c150d] text-sm font-medium leading-normal hover:text-[#f38406] transition-all duration-300 cursor-pointer font-body relative group px-4 py-2.5 rounded-full hover:bg-white/80 hover:shadow-sm"
				>
					How it works
					<span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#f38406] to-[#e07405] transition-all duration-300 group-hover:w-2/4 rounded-full"></span>
				</motion.button>
			</motion.div>
				{isLoading ? (
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
					</div>
				) : isAuthenticated ? (
					<div className="relative">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowDropdown(!showDropdown)}
							className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 hover:bg-white/80 border border-white/40 backdrop-blur-sm transition-all duration-300"
						>
							<div className="w-8 h-8 bg-gradient-to-r from-[#f38406] to-[#e07405] rounded-full flex items-center justify-center text-white font-bold text-sm">
								{user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U"}
							</div>
							<span className="text-[#1c150d] font-medium text-sm">
								{user?.firstName || user?.name?.split(' ')[0] || "User"}
							</span>
							<ChevronDown
								className={`w-4 h-4 text-[#1c150d] transition-transform duration-200 ${
									showDropdown ? "rotate-180" : ""
								}`}
							/>
						</motion.button>

						{showDropdown && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
							>
								<button
									onClick={() => {
										router.push("/profile");
										setShowDropdown(false);
									}}
									className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
								>
									<User className="w-4 h-4" />
									Profile
								</button>
								<button
									onClick={() => {
										router.push("/dashboard");
										setShowDropdown(false);
									}}
									className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
								>
									<Settings className="w-4 h-4" />
									Dashboard
								</button>
								<hr className="my-1" />
								<button
									onClick={handleLogout}
									className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
								>
									<LogOut className="w-4 h-4" />
									Sign Out
								</button>
							</motion.div>
						)}
					</div>
				) : (
					<>
						<motion.button
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={openLogin}
							className="text-[#1c150d] text-sm font-medium leading-normal hover:text-[#f38406] transition-all duration-300 cursor-pointer font-body px-5 py-2.5 rounded-full hover:bg-white/60 border border-transparent hover:border-white/40 backdrop-blur-sm"
						>
							Sign In
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => router.push("/signup")}
							className="flex min-w-[130px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-7 bg-gradient-to-r from-[#f38406] via-[#e07405] to-[#d06304] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:from-[#e07405] hover:via-[#d06304] hover:to-[#c05503] transition-all duration-300 font-body shadow-lg hover:shadow-xl relative group"
						>
							<span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
							<span className="relative">Get Started</span>
						</motion.button>
					</>
				)}
			</motion.div>
		</motion.nav>
	);
}
