"use client";
import React from "react";
import Image from "next/image";
import TopSidebar from "./TopSidebar";
import BottomSidebar from "./BottomSidebar";
import { Nunito, Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { useClickedStore } from "@/zustand";

const Sidebar = () => {
	const { clicked } = useClickedStore();
	return (
		<aside
			className={`${
				clicked
					? "absolute top-0 w-52 h-screen bg-white rounded-r-lg shadow-[6px_0_8px_-2px_rgba(0,0,0,0.2)]  transition-all ease-in-out duration-100"
					: "w-12"
			}  h-full left-0 bg-gray-200 px-1 z-50 hidden md:flex flex-col items-start`}>
			{clicked && (
				<div className="flex flex-row gap-1 items-center mt-1">
					<Image
						src={"/assets/images/chatterbox-logo.png"}
						className="w-6 h-6 object-cover mt-1"
						width={100}
						height={100}
						alt="logo"
					/>
					<p
						className={`text-[13px] mt-[3px] right-0 text-[#3a0657] ${poppins.className}`}>
						Chatterbox
					</p>
				</div>
			)}
			<div
				className={`flex flex-col items-center justify-between w-full h-full`}>
				<TopSidebar />
				<BottomSidebar />
			</div>
		</aside>
	);
};

export default Sidebar;
