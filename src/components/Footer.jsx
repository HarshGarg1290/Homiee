import { motion } from "framer-motion";
import { footerLinks } from "../lib/data";

export default function Footer() {
	return (
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
						{footerLinks.map((item, index) => (
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
						))}
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
	);
}
