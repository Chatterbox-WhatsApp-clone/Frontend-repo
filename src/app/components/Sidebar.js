"use client";
import React from "react";
import Image from "next/image";
import TopSidebar from "./TopSidebar";
import BottomSidebar from "./BottomSidebar";
import { Poppins } from "next/font/google";
import { useClickedStore } from "@/zustand";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Sidebar = () => {
	const { clicked } = useClickedStore();

	return (
		<aside className="hidden h-full z-50 md:flex flex-col items-start w-12 ">
			{/* Expanded Sidebar */}
			<div
				className={`${
					clicked
						? "fixed w-52 z-50 top-0 left-0 h-screen bg-white rounded-r-lg shadow-[6px_0_8px_-2px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-in-out px-1"
						: ""
				} `}>
				{clicked && (
					<div className="flex flex-col h-full ">
						{/* Logo */}
						<div className="flex items-center gap-1 px-1 mt-2">
							<Image
								src="/assets/images/chatterbox-logo.png"
								width={24}
								height={24}
								className="object-cover"
								alt="logo"
							/>
							<p className={`text-[13px] text-[#3a0657] ${poppins.className}`}>
								Chatterbox
							</p>
						</div>

						{/* Sidebar Content */}
						<div className="flex flex-col justify-between flex-1 mt-4">
							<TopSidebar />
							<BottomSidebar />
						</div>
					</div>
				)}
			</div>

			{/* Collapsed Sidebar (always visible icons) */}
			<div className="flex flex-col items-center justify-between h-full w-full px-1 bg-gray-200 shrink-0">
				<TopSidebar />
				<BottomSidebar />
			</div>
		</aside>
	);
};

export default Sidebar;
