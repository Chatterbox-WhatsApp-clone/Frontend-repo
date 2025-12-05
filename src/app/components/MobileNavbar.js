"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiPhoneCall } from "react-icons/fi";
import { LuMessageCircleMore } from "react-icons/lu";
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { Nunito, Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
const MobileNavbar = () => {
	const pathname = usePathname();
	const isChatActive = pathname === "/";
	const friends =
		pathname.includes("/friends") ||
		pathname.includes("/friends/request") ||
		pathname.includes("/friends/online") ||
		pathname.includes("/friends/all");

	return (
		<nav className="fixed z-50 bottom-0 left-0 right-0 flex flex-row justify-evenly w-full items-center md:hidden bg-white h-14 shadow-[6px_0_8px_-2px_rgba(0,0,0,0.2)] rounded-t-2xl">
			<div className="flex flex-row justify-evenly items-center w-full">
				{/* Chats */}
				<Link
					href="/"
					className="flex flex-col items-center space-y-1">
					<div
						className={`w-8 h-7 flex justify-center items-center ${
							isChatActive ? "bg-[#7e5497] rounded-lg" : ""
						}`}>
						<LuMessageCircleMore className="text-[18px]" />
					</div>

					<span
						className={`text-[12px] mt-[2px] ${
							isChatActive ? "font-bold text-black" : "text-black"
						} ${poppins.className}`}>
						Chats
					</span>
				</Link>

				{/* Chats */}

				{/* Friends */}
				<Link href="/friends" className="flex flex-col items-center space-y-1">
					<div
						className={`w-8 h-7 flex justify-center items-center ${
							friends ? "bg-[#7e5497] rounded-lg " : ""
						}`}>
						<MdOutlineGroupAdd
							className={`text-[20px]
							}`}
						/>
					</div>
					<span
						className={`text-[12px] mt-[2px]  ${
							friends ? "font-bold text-black" : "text-black"
						} ${poppins.className}`}>
						{" "}
						Friends{" "}
					</span>
				</Link>

				{/* Calls */}
				<Link href="/calls" className="flex flex-col items-center space-y-1">
					<div
						className={`w-8 h-7 flex justify-center items-center ${
							pathname === "/calls" ? "bg-[#7e5497] rounded-lg " : ""
						}`}>
						<FiPhoneCall
							className={`text-[18px]
							}`}
						/>
					</div>
					<span
						className={`text-[12px] ${poppins.className}  ${
							pathname === "/calls" ? "font-bold text-black" : "text-black"
						}`}>
						Calls
					</span>
				</Link>

				{/* Settings */}
				<Link href="/setting" className="flex flex-col items-center space-y-1">
					<div
						className={`w-8 h-7 flex justify-center items-center ${
							pathname === "/setting" ? "bg-[#7e5497] rounded-lg " : ""
						}`}>
						<IoSettingsOutline
							className={`text-[19px]
							}`}
						/>
					</div>

					<span
						className={`text-[12px] mt-[2px] ${
							pathname === "/setting" ? "font-bold text-black" : "text-black"
						}  ${poppins.className}`}>
						{" "}
						Setting
					</span>
				</Link>
			</div>
		</nav>
	);
};

export default MobileNavbar;
