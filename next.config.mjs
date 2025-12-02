/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "5001",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "backend-repo-d2mj.onrender.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
