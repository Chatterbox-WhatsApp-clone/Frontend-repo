"use client";
import React from "react";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { LuMessageCircleMore } from "react-icons/lu";
import { MdOutlineGroupAdd } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { usePathname } from "next/navigation";
import { useClickedStore } from "@/zustand";
import { Nunito, Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const TopSidebar = () => {
	const pathname = usePathname();
	const { clicked, setClicked } = useClickedStore();
	const friends =
		pathname.startsWith("/friends") ||
		pathname.startsWith("/friends/request") ||
		pathname.startsWith("/friends/online") ||
		pathname.startsWith("/friends/all");

	return (
		<div className="flex flex-col justify-start items-start w-full">
			<div
				className="bg-transparent hover:bg-gray-200 py-[10px] rounded-md mt-5 flex justify-center items-center cursor-pointer px-2"
				onClick={() => setClicked(!clicked)}>
				<RxHamburgerMenu className="text-lg text-black " />
			</div>

			<div className="flex flex-col justify-start items-start space-y-7 mt-8 w-full">
				<Link
					href={"/"}
					className={`${
						pathname === "/" ? "navigation w-full" : "w-full"
					} flex justify-start items-center `}>
					<LuMessageCircleMore className="text-[18px] text-black ml-[6px]" />
					<span
						className={`text-sm ml-2 ${poppins.className} ${
							clicked ? "flex" : "hidden"
						} `}>
						Chats
					</span>
				</Link>

				<Link
					href={"/friends"}
					className={`${
						friends ? "navigation w-full" : "w-full"
					} flex justify-start items-center `}>
					<MdOutlineGroupAdd className="text-xl text-black ml-2" />
					<span
						className={`text-sm ml-2 ${poppins.className} ${
							clicked ? "flex" : "hidden"
						} `}>
						Friends
					</span>
				</Link>

				<Link
					href={"/calls"}
					className={`${
						pathname === "/calls" ? "navigation w-full" : "w-full"
					} flex justify-start items-center `}>
					<FiPhoneCall className="text-[17px] text-black ml-2" />
					<span
						className={`text-sm ml-3 ${poppins.className} ${
							clicked ? "flex" : "hidden"
						} `}>
						Calls
					</span>
				</Link>
			</div>
		</div>
	);
};

export default TopSidebar;
