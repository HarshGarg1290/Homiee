import { User, Search, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import { animations } from "./animations/animationVariants";
import { featuresData } from "../lib/data";

// Icon mapping
const iconMap = {
	User: User,
	Search: Search,
	Heart: Heart,
};

export default function FeaturesSection() {
	const { ref, controls } = useScrollAnimation();

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={animations.staggerContainer}
			className="flex flex-col gap-10 px-4 py-10 @container"
		>
			<motion.div className="flex flex-col gap-4">
				<motion.h1
					variants={animations.textReveal}
					className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-heading"
				>
					Why Choose Homiee?
				</motion.h1>
				<motion.p
					variants={animations.textReveal}
					className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body"
				>
					We understand that finding the right people to live with is more
					important than just finding a place. That's why we've built a platform
					that prioritizes compatibility and community.
				</motion.p>
			</motion.div>
			<motion.div className="flex flex-col sm:grid sm:grid-cols-3  gap-6">
				{featuresData.map((item, index) => {
					const IconComponent = iconMap[item.iconName];
					return (
						<motion.div
							key={item.title}
							whileHover={{ y: -6 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="flex flex-1 gap-3 rounded-lg border border-[#e9dcce] bg-[#fcfaf8] p-6 flex-col transition-all duration-300 hover:shadow-lg hover:border-[#f38406]/20 cursor-pointer group"
						>
							<div className="text-[#f38406] transition-transform duration-300">
								<IconComponent className="w-6 h-6" />
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
					);
				})}
			</motion.div>
		</motion.div>
	);
}
