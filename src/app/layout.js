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
							<div className="flex h-full">
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
