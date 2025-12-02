"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
// import { useState, useEffect } from "react";
import {
	useAuthenticatedStore,
	useUserProfile,
	useClickedStore,
} from "@/zustand";
import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import {
	FaRegImage,
	FaRegFileVideo,
	FaRegFileAudio,
	FaRegFile,
} from "react-icons/fa";
const AllChats = () => {
	const { token } = useAuthenticatedStore();
	const router = useRouter();
	const { activeChat, setActiveChat, setChatId, setIsFavourites } =
		useUserProfile();
	const { setOpenMessage } = useClickedStore();
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	// fetch online users
	const onlineEndpoint = process.env.NEXT_PUBLIC_GET_USER_CHATS_ENDPOINT;
	const fetchUsers = async () => {
		const res = await fetch(onlineEndpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data } = useQuery({
		queryKey: ["users-chat"],
		queryFn: fetchUsers,
		staleTime: 100000,
		cacheTime: 300000,
	});

	const getMediaPreview = (mimeType, filename) => {
		if (!mimeType) return { icon: <FaRegFile />, label: filename || "File" };

		if (mimeType.startsWith("image/")) {
			return { icon: <FaRegImage />, label: "Image" };
		}

		if (mimeType.startsWith("video/")) {
			return { icon: <FaRegFileVideo />, label: "Video" };
		}

		if (mimeType.startsWith("audio/")) {
			return { icon: <FaRegFileAudio />, label: "Audio" };
		}

		return { icon: <FaRegFile />, label: filename || "File" };
	};

	return (
		<div className="h-full relative flex justify-center items-center overflow-y-auto w-full">
			{data?.data?.length === 0 ? (
				<div className="flex flex-col justify-center items-center gap-3 relative mt-32">
					<p
						className={`${poppins.className}  text-wrap text-center text-sm font-mono`}>
						You haven't sent or received any messages. Your list of messages
						will appear here.
					</p>
					<button
						onClick={(e) => router.push("/friends")}
						className="rainbow-hover bg-[#7e5497] h-10 px-5 flex flex-row items-center justify-center rounded-2xl text-white cursor-pointer">
						<span className={`text-sm text-center ${poppins.className}`}>
							Go to Friends Page
						</span>
						<IoIosArrowForward className="text-lg" />
					</button>
				</div>
			) : (
				<div className="flex flex-col h-full justify-center items-center w-full mt-1 px-1">
					{data?.data?.map((chat) => {
						const profilePicture = chat?.user?.profilePicture
							? `${backendBase}${chat?.user?.profilePicture}`
							: "/assets/images/friendImage.jpg";
						const media = chat?.lastMessage?.content?.media;
						const mime = media?.mimeType;
						const filename = media?.filename;

						const preview = getMediaPreview(mime, filename);

						return (
							<div
								className={`h-[70px] w-full py-1 shrink-0 cursor-pointer ${
									activeChat?.chatId === chat?.chatId
										? "bg-gray-200"
										: "bg-transparent"
								} hover:bg-gray-200 px-1 cursor-pointer`}
								key={chat?.chatId}
								onClick={() => {
									setOpenMessage(true);
									setActiveChat(chat);
									setChatId(chat?.chatId);
									setIsFavourites(chat?.isFavourite);
								}}>
								<div className="h-[60px] w-full flex justify-between items-center flex-row  cursor-pointer">
									<div className="flex justify-center items-center flex-row space-x-4 md:space-x-2 lg:space-x-3 w-full">
										<div className="h-[60px] w-[60px] flex-shrink-0 relative">
											<Image
												src={profilePicture}
												width={70}
												height={70}
												alt="profilePicture"
												className="w-full h-full rounded-full object-cover"
											/>
											{chat?.unreadCount > 0 && (
												<div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
													{chat.unreadCount > 99 ? "99+" : chat.unreadCount}
												</div>
											)}
										</div>

										<div className="flex flex-col justify-center items-start w-full gap-1">
											<div className="flex flex-row justify-between items-center w-full">
												<p
													className={`${poppins.className} font-medium text-[13.5px]`}>
													{chat?.user?.username?.length > 18
														? chat?.user?.username.slice(0, 18) + "..."
														: chat?.user?.username}
												</p>
												<div className="flex flex-col space-y-1">
													<p className="text-[10.5px] text-normal">
														{(() => {
															const date = new Date(chat?.lastMessageTime);
															const now = new Date();
															const diffInMs = now - date;
															const diffInHours = diffInMs / (1000 * 60 * 60);

															if (diffInHours < 24) {
																return date.toLocaleTimeString([], {
																	hour: "2-digit",
																	minute: "2-digit",
																});
															} else if (diffInHours < 48) {
																return "Yesterday";
															} else {
																return date.toLocaleDateString([], {
																	day: "2-digit",
																	month: "2-digit",
																	year: "numeric",
																});
															}
														})()}
													</p>
													{chat?.unreadCount > 1 && (
														<span className="w-[14px] h-[14px] rounded-full bg-[#7304af] text-[11px] font-bold text-white flex justify-center items-center ml-auto">
															{chat?.unreadCount}
														</span>
													)}
												</div>
											</div>
											{mime ? (
												<p
													className={`flex items-center space-x-2 
														${poppins.className}
													 text-gray-700 text-[12px]`}>
													{preview.icon}
													<span>{preview.label}</span>
												</p>
											) : (
												<p
													className={`${
														poppins.className
													} text-gray-700 text-[12px] ${
														chat?.unreadCount > 1 ? "-mt-2" : ""
													}`}>
													{chat?.lastMessage?.content?.text?.length > 30
														? chat.lastMessage.content.text.slice(0, 30) + "..."
														: chat?.lastMessage?.content?.text}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default AllChats;
