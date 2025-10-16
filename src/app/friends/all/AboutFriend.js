"use client";

import React from "react";
import { Poppins, Nunito } from "next/font/google";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { useUserProfile } from "@/zustand";

const AboutFriend = () => {
	const { activeUser } = useUserProfile();
	return (
		<div className="flex bg-white mt-4 flex-col gap-3 w-full rounded-lg shadow-lg px-3 py-5 border border-gray-100">
			<p className={`text-lg ${nunito.className} font-bold`}>About</p>
			<p className={`font-bold text-base ${nunito.className}`}>
				Bio: {""}
				{""}
				<span className={`text-base font-normal `}>{activeUser?.bio}</span>
			</p>
			<p className={`font-bold text-base ${nunito.className}`}>
				Date Joined: {""}
				<span className={`text-base font-normal `}>
					{" "}
					{activeUser?.dateJoined}
				</span>
			</p>
			<p className={`font-bold text-base ${nunito.className}`}>
				Last Seen: {""}
				<span className={`text-base font-normal `}>
					{new Date(activeUser?.lastSeen).toLocaleString()}
				</span>{" "}
			</p>
			<p className={`font-bold text-base ${nunito.className}`}>
				Friends Since: {""}
				<span className={`text-base font-normal `}>
					{new Date(activeUser?.lastSeen).toLocaleString()}
				</span>{" "}
			</p>
		</div>
	);
};

export default AboutFriend;
