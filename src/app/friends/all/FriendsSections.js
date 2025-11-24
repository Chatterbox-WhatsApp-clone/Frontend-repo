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
	const [activeTab, setActiveTab] = useState("all");

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

	return (
		<div className="flex flex-col gap-2 bg-white h-auto w-full py-2 px-2 rounded-md">
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
					{activeUser?.nonMutualFriends?.length === 0 ? (
						<p className="text-gray-800 text-base text-center font-semibold flex justify-center items-center w-full mt-5">
							Looks like you already have all the same friends!
						</p>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3">
							{activeUser?.nonMutualFriends?.map((friend) => {
								const profilePicture = friend?.profilePicture
									? `${backendBase}${friend.profilePicture}`
									: "/assets/images/userImage.jpg";

								return (
									<div
										className="w-full flex flex-row justify-between items-center p-2 "
										key={friend._id}>
										<div className="flex items-center space-x-3">
											<Image
												src={profilePicture}
												width={100}
												height={100}
												alt="Profile Picture"
												className="rounded-lg"
											/>
											<p
												className={`text-base font-semibold ${poppins.className}`}>
												{friend.username}
											</p>
										</div>
										<div className="w-[40%]">
											<AddFriendButton friend={friend._id} />
										</div>
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

