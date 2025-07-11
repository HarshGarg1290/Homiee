import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useModal } from "../contexts/ModalContext";

export default function Navbar({ scrollToSection }) {
	const router = useRouter();
	const { openLogin } = useModal();

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
						className="relative w-10 h-10 rounded-md transition-all duration-300"
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
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6, delay: 0.5 }}
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
			</motion.div>
		</motion.nav>
	);
}
