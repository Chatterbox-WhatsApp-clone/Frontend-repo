"use client";
import "./global.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileNavbar from "./components/MobileNavbar";
import { useAuthenticatedStore } from "@/zustand";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import FetchUser from "./FetchUser";
import { useRouter } from "next/navigation";

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
	],
	authors: [{ name: "Chatterbox Team" }],
	creator: "Chatterbox",
	metadataBase: new URL("https://frontend-repo-rho.vercel.app"),

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
	},
};

<script
	type="application/ld+json"
	dangerouslySetInnerHTML={{
		__html: JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebApplication",
			name: "Chatterbox",
			url: "https://frontend-repo-rho.vercel.app",
			applicationCategory: "CommunicationApplication",
			description:
				"Chatterbox lets you connect, message, and share moments with friends.",
			operatingSystem: "Web",
			image: "/assets/images/chatterbox-logo.png",
		}),
	}}
/>;



export default function RootLayout({ children }) {
	const queryClient = new QueryClient();
	const { authenticated } = useAuthenticatedStore();
	const [ready, setReady] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const redirect = async () => {
			if (authenticated) {
			} else {
			}
			setReady(true);
		};

		redirect();
		setReady(true);
	}, [authenticated, router]);

	return (
		<QueryClientProvider client={queryClient}>
			<FetchUser />
			<html lang="en">
				<body className="h-screen w-full overflow-hidden">
					{authenticated ? (
						<div className="flex flex-col h-screen">
							{ready && (
								<>
									<Navbar />
									<MobileNavbar />
								</>
							)}
							<div className="flex h-full min-h-0">
								<Sidebar />
								<main className="flex-1 h-full">{children}</main>
							</div>
						</div>
					) : (
						<main className="h-screen">{children}</main>
					)}
				</body>
			</html>
		</QueryClientProvider>
	);
}
