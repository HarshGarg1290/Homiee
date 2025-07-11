// Shared animation variants for consistent animations across components

export const fadeInUp = {
	hidden: { opacity: 0, y: 60 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
	},
};

export const fadeInLeft = {
	hidden: { opacity: 0, x: -60 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
	},
};

export const fadeInRight = {
	hidden: { opacity: 0, x: 60 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
	},
};

export const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

export const textReveal = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

export const scaleIn = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

export const slideInBottom = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut" },
	},
};

export const cardHover = {
	hover: {
		y: -8,
		transition: { duration: 0.3, ease: "easeOut" },
	},
};

export const buttonHover = {
	hover: {
		scale: 1.05,
		transition: { duration: 0.2, ease: "easeOut" },
	},
	tap: {
		scale: 0.95,
		transition: { duration: 0.1, ease: "easeOut" },
	},
};
