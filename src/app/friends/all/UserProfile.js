"use client";
import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { Nunito, Poppins } from "next/font/google";
import { useUserProfile } from "@/zustand";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { FaArrowLeft } from "react-icons/fa6";
import UserProfileBackgroundImage from "./UserProfileBackgroundImage";
import AboutFriend from "./AboutFriend";
import FriendsSections from "./FriendsSections";
const UserProfile = () => {
	{
		/* only when clicked on mobile should you apply messages */
	}
	const { activeUser, setActiveUser } = useUserProfile();
	const [activeTab, setActiveTab] = useState("about");

	return (
		<>
			{!activeUser ? (
				<div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-3 ">
					<FaUserFriends className="hidden md:block" size={80} />
					<h1
						className={`${nunito.className} text-lg sm:text-xl text-gray-800 font-bold text-center hidden md:block`}>
						Select people&apos;s names to preview their profile.
					</h1>
				</div>
			) : (
				<div
					className={`w-full h-full overflow-y-auto flex flex-col justify-start items-start transition-transform duration-500 ease-in-out pb-2  ${
						activeUser
							? "fixed top-0 translate-x-0 messages bg-gray-200"
							: "translate-x-full"
					} md:flex md:flex-1 md:relative md:bg-transparent`}
					key={activeUser._id}>
					<div className="fixed top-2 left-2 flex justify-center items-center bg-white h-8 w-8 rounded-full shadow-md md:hidden z-50">
						<FaArrowLeft
							className="text-lg text-black cursor-pointer"
							onClick={() => setActiveUser(null)}
						/>
					</div>

					<UserProfileBackgroundImage
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
					<div className="px-1 w-full mt-3">
						{activeUser && activeTab === "about" && <AboutFriend />}
						{activeUser && activeTab === "friends" && <FriendsSections />}
					</div>
				</div>
			)}
		</>
	);
};

export default UserProfile;
