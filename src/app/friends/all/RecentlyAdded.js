"use client";
import React from "react";
import { useUserProfile } from "@/zustand";
import AddFriendButton from "../AddFriendButton";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const RecentlyAdded = () => {
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const { activeUser } = useUserProfile();

	return (
		<div className="grid grid-cols lg:grid-cols-2 gap-1 md:gap-2 place-items-center ">
			{!activeUser?.friends?.recentFriends?.length ? (
				<p className="text-gray-800 text-lg font-semibold flex justify-center items-center w-full h-full mt-[5%] relative">
					{activeUser?.username} hasn’t added anyone new this week.
				</p>
			) : (
				activeUser?.friends?.recentFriends?.map((friend) => {
					const profilePicture = friend?.profilePicture
						? `${backendBase}${friend?.profilePicture}`
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
							<AddFriendButton friend={friend?._id} />
						</div>
					);
				})
			)}
		</div>
	);
};

export default RecentlyAdded;
