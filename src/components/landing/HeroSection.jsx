import { useRouter } from "next/router";
import { motion } from "framer-motion";

const HeroSection = () => {
	const router = useRouter();

	return (
		<div className="px-10 lg:px-40 flex justify-center py-5 pt-20">
			<div className="max-w-[1200px] w-full flex flex-col">
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
			</div>
		</div>
	);
};

export default HeroSection;
