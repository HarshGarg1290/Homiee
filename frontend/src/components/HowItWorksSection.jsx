import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../lib/smoothScroll";
import { animations } from "./animations/animationVariants";
import { servicesData } from "../lib/data";

export default function HowItWorksSection() {
	const { ref, controls } = useScrollAnimation();
	const router = useRouter();

	const handleServiceClick = (service) => {
		if (service.route) {
			router.push(service.route);
		}
	};

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={animations.staggerContainer}
			className="flex flex-col gap-10 px-4 py-10 @container"
		>
			<motion.div variants={animations.fadeInUp} id="how-it-works" className="flex flex-col gap-4">
				<motion.h1
					variants={animations.textReveal}
					className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] font-heading"
				>
					How Homiee Works
				</motion.h1>
				<motion.p
					variants={animations.textReveal}
					className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body"
				>
					Our platform uses intelligent matching to connect you with flatmates
					and flats that fit your lifestyle and preferences. We also provide
					curated local insights to help you explore your neighborhood and build
					meaningful connections in your city.
				</motion.p>
			</motion.div>
			<motion.div
				variants={animations.staggerContainer}
				className=" flex flex-col sm:grid sm:grid-cols-3 gap-6"
			>
				{servicesData.map((item, index) => (
					<motion.div
						key={item.title}
						whileHover={{ y: -8 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						onClick={() => handleServiceClick(item)}
						className="service-card flex flex-col gap-3 pb-3 cursor-pointer group transition-shadow duration-300"
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
