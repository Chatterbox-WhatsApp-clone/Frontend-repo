"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { BiDotsHorizontalRounded } from "react-icons/bi";
import FriendOptions from "./FriendOptions";

const ProfileDetails = ({ activeTab, setActiveTab }) => {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<>
			<div className="w-full px-3 mt-4 h-10 flex justify-between items-center gap-4">
				<div className="flex gap-4 ">
					<button
						onClick={() => setActiveTab("about")}
						className={`${poppins.className} cursor-pointer  ${
							activeTab === "about" ? "userTab  font-semibold" : ""
						}`}>
						About
					</button>
					<button
						onClick={() => setActiveTab("friends")}
						className={`${poppins.className} cursor-pointer ${
							activeTab === "friends" ? "userTab font-semibold" : ""
						}`}>
						Friends
					</button>
				</div>

				<div className="cursor-pointer relative bg-gray-200 h-8 w-8 rounded-full flex justify-center items-center">
					<BiDotsHorizontalRounded
						className="text-gray-800 text-2xl z-50"
						onClick={() => {
							openModal();
						}}
					/>
					{isOpen && <FriendOptions closeModal={closeModal} />}
				</div>
			</div>
		</>
	);
};

export default ProfileDetails;
