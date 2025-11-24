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
	const { activeUser, setActiveUser } = useUserProfile();
	const [activeTab, setActiveTab] = useState("about");

	// Reusable content rendering
	const ProfileContent = () => (
		<>
			<UserProfileBackgroundImage
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<div className="w-full z-0 mt-3">
				{activeUser && activeTab === "about" && <AboutFriend />}
				{activeUser && activeTab === "friends" && <FriendsSections />}
			</div>
		</>
	);

	return (
		<>
			{/* Desktop placeholder when no active user */}
			{!activeUser && (
				<div className="hidden md:flex flex-1 w-full h-full flex-col justify-center items-center  ">
					<FaUserFriends className="" size={80} />
					<h1
						className={`${nunito.className} text-lg sm:text-xl text-gray-800 font-bold text-center `}>
						Select people&apos;s names to preview their profile.
					</h1>
				</div>
			)}

			{/* Desktop panel (md and up). No fixed/inset classes; stable height and internal scroll. */}
			{activeUser && (
				<div className="hidden md:flex md:flex-1 md:h-full md:flex-col overflow-y-auto">
					<div className="w-full h-full flex flex-col overflow-hidden min-h-0">
						<div
							className="w-full flex-1 overflow-y-auto px-1"
							style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}>
							<ProfileContent />
						</div>
					</div>
				</div>
			)}

			{/* Mobile overlay (below md). Only renders when activeUser is set. */}
			{activeUser && (
				<div className="md:hidden fixed inset-0 translate-x-0 messages bg-gray-200 transition-transform duration-500 ease-in-out flex flex-col">
					<div className="fixed top-2 left-2 flex justify-center items-center bg-white h-8 w-8 rounded-full shadow-md md:hidden z-50">
						<FaArrowLeft
							className="text-lg text-black cursor-pointer"
							onClick={() => setActiveUser(null)}
						/>
					</div>
					<div className="w-full flex-1 px-1 overflow-y-auto">
						<ProfileContent />
					</div>
				</div>
			)}
		</>
	);
};

export default UserProfile;
