import "./global.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
	title: "Chatterbox! Connect, Message & Share Moments",
	description:
		"Chatterbox is a fast and secure messaging platform where you connect, chat, and share unforgettable moments with friends.",
	keywords: [
		"chat app",
		"messaging app",
		"Chatterbox",
		"connect with friends",
		"share moments",
		"real-time chat",
		"web chat",
		"secure messaging",
		"video calls",
		"voice notes"
	],
	authors: [{ name: "Chatterbox Team" }],
	creator: "Chatterbox",
	metadataBase: new URL("https://frontend-repo-rho.vercel.app"),
	applicationName: "Chatterbox",
	openGraph: {
		title: "Chatterbox! Connect, Message & Share Moments",
		description:
			"A modern messaging app to chat, connect, and share your best moments instantly.",
		url: "https://frontend-repo-rho.vercel.app",
		siteName: "Chatterbox",
		images: [
			{
				url: "/assets/images/chatterbox-logo.png",
				width: 1200,
				height: 630,
				alt: "Chatterbox App Preview",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Chatterbox — Connect & Share Moments",
		description:
			"Chat, connect and share unforgettable moments with friends on Chatterbox.",
		images: ["/assets/images/chatterbox-logo.png"],
		creator: "@chatterbox",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="h-screen w-full overflow-hidden">
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
