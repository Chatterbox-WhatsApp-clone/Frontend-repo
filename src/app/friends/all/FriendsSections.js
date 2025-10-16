"use client";
import React, { useState } from "react";
import { useUserProfile } from "@/zustand";
import AddFriendButton from "../AddFriendButton";
import Image from "next/image";
import { Nunito, Poppins } from "next/font/google";
import RecentlyAdded from "./RecentlyAdded";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const FriendsSections = () => {
	const { activeUser } = useUserProfile();
	const [activeTab, setActiveTab] = useState("all"); // default: "all"

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

	return (
		<div className="flex flex-col gap-2 bg-white w-full h-auto py-2 px-2 rounded-md">
			{/* Tabs */}
			<div className="flex space-x-10">
				<button
					onClick={() => setActiveTab("all")}
					className={`${poppins.className} cursor-pointer ${
						activeTab === "all"
							? "bg-gray-200 py-2 px-3 rounded-md font-semibold"
							: ""
					}`}>
					All Friends
				</button>
				<button
					onClick={() => setActiveTab("recent")}
					className={`${poppins.className} cursor-pointer ${
						activeTab === "recent"
							? "bg-gray-200 py-2 px-3 rounded-md font-semibold"
							: ""
					}`}>
					Recently Added
				</button>
			</div>

			{/* Friends Grid */}
			{activeTab === "all" && (
				<>
					{!activeUser?.friends?.nonMutualFriends?.length ? (
						<p className="text-gray-800 text-lg font-semibold flex justify-center items-center w-full h-full mt-[5%] relative">
							You already share all friends in
							common.
						</p>
					) : (
						<div className="grid grid-cols lg:grid-cols-2 gap-1 md:gap-2 place-items-center">
							{activeTab === "all" &&
								activeUser?.friends?.nonMutualFriends?.map((friend) => {
									const profilePicture = friend?.profilePicture
										? `${backendBase}${friend.profilePicture}`
										: "/assets/images/userImage.jpg";

									return (
										<div
											className="w-full flex flex-row justify-between items-center"
											key={friend._id}>
											<div className="flex flex-row space-x-2 md:space-x-3 justify-start items-center w-full">
												<Image
													src={profilePicture}
													width={100}
													height={100}
													alt="Profile Picture"
													className="w-[100px] h-[100px] rounded-lg"
												/>
												<p className={`text-base ${poppins.className}`}>
													{friend.username}
												</p>
											</div>
											<AddFriendButton friend={friend._id} />
										</div>
									);
								})}
						</div>
					)}
				</>
			)}

			{activeTab === "recent" && <RecentlyAdded />}
		</div>
	);
};

export default FriendsSections;
