import { motion } from "framer-motion";
import { useScrollAnimation } from "../lib/smoothScroll";
import { animations } from "./animations/animationVariants";
import { eventsData } from "../lib/data";

export default function EventsSection() {
	const { ref, controls } = useScrollAnimation();

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={animations.staggerContainer}
			id="events"
			className="events-section flex flex-col gap-10 px-4 py-10 @container"
		>
			<motion.div variants={animations.fadeInUp} className="flex flex-col gap-4">
				<motion.h1
					variants={animations.textReveal}
					className="events-title text-[#1c150d] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-heading"
				>
					Around The City
				</motion.h1>
				<motion.p
					variants={animations.textReveal}
					className="text-[#1c150d] text-base font-normal leading-normal max-w-[720px] font-body"
				>
					Explore what your city has to offer and connect with communities that
					share your interests.
				</motion.p>
			</motion.div>
			<motion.div
				variants={animations.staggerContainer}
				className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
			>
				{eventsData.map((item, index) => (
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
