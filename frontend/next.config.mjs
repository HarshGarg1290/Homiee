/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	experimental: {
		forceSwcTransforms: true,
	},
	transpilePackages: ["framer-motion"],
	images: {
		domains: ["ui-avatars.com"],
	},
};

export default nextConfig;
