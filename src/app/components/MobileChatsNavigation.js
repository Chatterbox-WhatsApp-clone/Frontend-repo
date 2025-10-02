"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nunito, Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import Unread from "../chats/Unread";
import Favourites from "../chats/Favourites";
import Starred from "../chats/Starred";
import AllChats from "../chats/AllChats";

const MobileChatsNavigation = () => {
	const pathname = usePathname();
	return (
		<div
			className="w-full h-7 overflow-x-auto scroll-smooth md:hidden"
			style={{ scrollbarWidth: "none" }}>
			<div className="w-full flex flex-row justify-center items-center gap-5 h-full ">
				<Link
					href="/dashboard/chats"
					className={`h-6 w-full text-center rounded-full px-2 ${
						pathname === "/dashboard/chats"
							? "bg-[#c2b6ca] border border-gray-400"
							: "border border-gray-400"
					}`}>
					<p className={`text-[12px] mt-[2px] ${poppins.className}`}>All</p>
				</Link>
				<Link
					href="/dashboard/unread"
					className={`h-6 w-full text-center rounded-full px-2 ${
						pathname.startsWith("/dashboard/unread")
							? "bg-[#c2b6ca] border border-gray-400"
							: "border border-gray-400"
					}`}>
					<p className={`text-[12px] mt-[2px] ${poppins.className}`}>Unread</p>
				</Link>
				<Link
					href="/dashboard/favourites"
					className={`h-6 w-full text-center rounded-full px-2 ${
						pathname.startsWith("/dashboard/favourites")
							? "bg-[#c2b6ca] border border-gray-400"
							: "border border-gray-400"
					}`}>
					<p className={`text-[12px] mt-[2px] ${poppins.className}`}>
						Favourites
					</p>
				</Link>
				<Link
					href="/dashboard/starred"
					className={`h-6 w-full text-center rounded-full px-2 ${
						pathname.startsWith("/dashboard/starred")
							? "bg-[#c2b6ca] border border-gray-400"
							: "border border-gray-400"
					}`}>
					<p className={`text-[12px] mt-[2px] ${poppins.className}`}>Starred</p>
				</Link>
			</div>
		</div>
	);
};

export default MobileChatsNavigation;
