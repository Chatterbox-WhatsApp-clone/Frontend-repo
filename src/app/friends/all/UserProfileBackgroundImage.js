"use client";
import React from "react";
import Image from "next/image";
import { useUserProfile } from "@/zustand";
import { Nunito, Poppins } from "next/font/google";
import ProfileDetails from "./ProfileDetails";
import { FaArrowLeft } from "react-icons/fa6";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const UserProfileBackgroundImage = ({ activeTab, setActiveTab }) => {
	const { activeUser, setActiveUser } = useUserProfile();

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

	const profilePicture = activeUser?.profilePicture
		? `${backendBase}${activeUser?.profilePicture}`
		: "/assets/images/userImage.jpg";

	return (
		<>
			<div className="flex flex-col w-full bg-white rounded-b-3xl pb-1">
				

				{/* Background image section */}
				<div className="h-64 w-full relative rounded-t-sm shrink-0 bg-gray-200">
					{activeUser?.backgroundImage && (
						<Image
							src={`${backendBase}${activeUser.backgroundImage}`}
							alt="Background"
							fill
							className="object-cover"
						/>
					)}
				</div>

				{/* Profile details section */}
				<div className="flex flex-row justify-between items-center px-2 z-10">
					<div className="flex flex-row space-x-3 md:space-x-4 items-center justify-start">
						<Image
							src={profilePicture}
							className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-full border-3 border-[#3a0657] object-cover object-center -mt-10 ml-2"
							width={100}
							height={100}
							alt="Profile Picture"
						/>
						<div className="flex flex-col items-start">
							<h1
								className={`${nunito.className} text-base md:text-lg font-bold text-center mr-auto`}>
								{activeUser.username}
							</h1>
							<p className={`text-base ${nunito.className}`}>
								Total Friends: {activeUser.totalContacts}
							</p>
						</div>
					</div>

					<button className="py-1 sm:py-2 w-28 sm:w-36 rounded-md bg-[#3a0657] text-white text-center">
						Message
					</button>
				</div>

				<section className="px-2 w-full">
					<ProfileDetails activeTab={activeTab} setActiveTab={setActiveTab} />
				</section>
			</div>
		</>
	);
};

export default UserProfileBackgroundImage;
