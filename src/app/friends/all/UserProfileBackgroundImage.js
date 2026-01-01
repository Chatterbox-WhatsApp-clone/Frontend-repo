"use client";
import React, { useState, lazy, Suspense } from "react";
import Image from "next/image";
import { useUserProfile, useAuthenticatedStore } from "@/zustand";
import { Nunito } from "next/font/google";
import ProfileDetails from "./ProfileDetails";
import ShowImages from "@/utils/ShowImages";
import { socket } from "@/socket";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const Chats = lazy(() => import("@/app/chats/ChatBackground"));
import { generateChatId } from "@/utils/GenerateChatId";
const UserProfileBackgroundImage = ({ activeTab, setActiveTab }) => {
	const { activeUser } = useUserProfile();
	const { userId, token } = useAuthenticatedStore();

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const profilePicture = activeUser?.profilePicture
		? `${activeUser?.profilePicture}`
		: "/assets/images/userImage.jpg";

	const backgroundImage = activeUser?.backgroundImage ? `${activeUser.backgroundImage}` : "";

	// show image.
	const [showImage, setShowImage] = useState(false);
	const [currentImage, setCurrentImage] = useState("");
	const [openChats, setOpenChats] = useState(false);
	const chatId = generateChatId(userId, activeUser?._id);

	const joinChats = () => {
		setOpenChats(true);
		socket.connect();
		socket.emit("authenticate", { userId, token });
		socket.emit("join_chat", { chatId });
	};

	return (
		<>
			<div className="flex flex-col w-full bg-white rounded-b-3xl pb-1">
				{/* Background image section */}
				<div className="h-60 w-full relative rounded-t-sm bg-gray-200">
					{activeUser?.backgroundImage && (
						<Image
							src={backgroundImage}
							alt="Background"
							fill
							className="object-cover"
							onClick={() => {
								setShowImage(true);
								setCurrentImage(backgroundImage);
							}}
						/>
					)}
				</div>

				{/* Profile details section */}
				<div className="flex flex-row justify-between items-center z-10">
					<div className="flex flex-row space-x-3 md:space-x-4 items-center justify-start">
						<Image
							src={profilePicture}
							className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-full border-3 border-[#3a0657] object-cover object-center -mt-10 ml-2"
							width={100}
							height={100}
							alt="Profile Picture"
							onClick={() => {
								setShowImage(true);
								setCurrentImage(profilePicture);
							}}
						/>
						<div className="flex flex-col items-start">
							<h1
								className={`${nunito.className} text-base md:text-lg font-bold text-center mr-auto`}>
								{activeUser?.username}
							</h1>
							<p className={`text-base ${nunito.className}`}>
								Total Friends: {activeUser?.contacts?.length}
							</p>
						</div>
					</div>

					<button
						className="py-1 sm:py-2 w-28 sm:w-36 rounded-md bg-[#3a0657] text-white text-center"
						onClick={joinChats}>
						Message
					</button>
				</div>

				<section className="w-full">
					<ProfileDetails activeTab={activeTab} setActiveTab={setActiveTab} />
				</section>
			</div>

			{showImage && (
				<ShowImages
					image={currentImage}
					setShowImage={setShowImage}
					showImage={showImage}
				/>
			)}

			{openChats && (
				<Suspense fallback={null}>
					<Chats setOpenChats={setOpenChats} />
				</Suspense>
			)}
		</>
	);
};

export default UserProfileBackgroundImage;
