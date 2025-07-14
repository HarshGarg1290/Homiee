import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../lib/smoothScroll";
import { animations } from "./animations/animationVariants";
import { useAuth } from "../contexts/AuthContext";

export default function CTASection() {
	const { ref, controls } = useScrollAnimation();
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	
	const handleGetStarted = () => {
		if (isAuthenticated) {
			router.push("/dashboard");
		} else {
			router.push("/signup");
		}
	};

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={animations.fadeInUp}
			className="@container"
		>
			<div className="flex flex-col sm: flex-row justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
				<motion.div
					variants={animations.textReveal}
					className="flex flex-col gap-2 text-center items-center"
				>
					<motion.h1
						variants={animations.textReveal}
						className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-heading text-center"
					>
						Ready to Find Your Tribe?
					</motion.h1>
					<motion.p
						variants={animations.textReveal}
						className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body text-center"
					>
						Join thousands of people who have found their perfect flatmates and
						discovered their new home through Homiee. Your tribe is waiting for
						you.
					</motion.p>
				</motion.div>
				<motion.div variants={animations.scaleIn} className="flex flex-1 justify-center">
					<div className="flex justify-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleGetStarted}
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
