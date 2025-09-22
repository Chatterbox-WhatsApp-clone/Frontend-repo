// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			// 👈 define here, not inside extend
			xs: "400px",
			sm: "576px", // now sm = 576px, default 640px is gone
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {}, // keep extend empty for other customizations
	},
	plugins: [],
};
