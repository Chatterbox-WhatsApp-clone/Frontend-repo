/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "backend-repo-d2mj.onrender.com",
				port: "",
				pathname: "/uploads/profilePics/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "5001",
				pathname: "/uploads/profilePics/**",
			},
		],
	},
};

export default nextConfig;
