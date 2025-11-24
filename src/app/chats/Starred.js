"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import {
	useAuthenticatedStore,
	useUserProfile,
	useClickedStore,
} from "@/zustand";
import Image from "next/image";
import { CiStar } from "react-icons/ci";
import { IoMdStar } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Starred = ({ setActiveTab }) => {
	const { token } = useAuthenticatedStore();
	const { setActiveUser } = useUserProfile();
	const { setOpenMessage } = useClickedStore();
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const onlineEndpoint = process.env.NEXT_PUBLIC_GET_STARRED_MESSAGE;

	const fetchUsers = async () => {
		const res = await fetch(onlineEndpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data } = useQuery({
		queryKey: ["users-starred"],
		queryFn: fetchUsers,
		staleTime: 100000,
		cacheTime: 300000,
	});

	return (
		<div className="h-full relative flex flex-col justify-start items-center overflow-y-auto w-full">
			<div className="w-full hidden md:flex flex-row items-center justify-start gap-2 p-2 border-b border-gray-200 ">
				<IoIosArrowForward
					className="text-xl cursor-pointer rotate-180"
					onClick={() => setActiveTab("All")}
				/>
				<h2 className={`${poppins.className} font-bold text-lg`}>
					Starred Messages
				</h2>
			</div>
			{data?.data?.length === 0 ? (
				<div className="flex flex-col justify-center items-center gap-3 relative mt-32 md:mt-1/2 ">
					<p
						className={`${poppins.className}  text-wrap text-center text-sm font-mono`}>
						You have no starred messages. Star messages to see them here.
					</p>
				</div>
			) : (
				<div className="flex flex-col h-full justify-start items-center w-full mt-1 px-1">
					{data?.data?.map((chat) => {
						const sender = chat?.sender || chat?.user;
						const username = sender?.username || sender?.phone || "Unknown";
						const type = chat?.type || (chat?.image ? "image" : "text");
						const content = chat?.content || chat?.message || "";
						const createdAt = chat?.createdAt || chat?.lastMessageTime;

						// Determine content type label
						let typeLabel = "Text";
						if (type === "image") typeLabel = "Image";
						if (type === "audio" || type === "voice") typeLabel = "Voice Note";
						if (type === "video") typeLabel = "Video";

						return (
							<div
								className={`w-full py-2 px-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex flex-row justify-between items-start overflow-hidden`}
								key={chat?._id || chat?.chatId}
								onClick={() => {
									setOpenMessage(true);
									setActiveUser(chat);
								}}>

								{/* Left Div: Username & Content Type */}
								<div className="flex flex-col justify-start items-start gap-1 max-w-[70%]">
									<p className={`${poppins.className} font-bold text-sm text-gray-900 truncate w-full`}>
										{username}
									</p>
									<p className={`${poppins.className} text-[12px] text-gray-500`}>
										{typeLabel}
									</p>
								</div>

								{/* Right Div: Item & Date */}
								<div className="flex flex-col justify-end items-end gap-1">
									{/* Item itself */}
									<div className="flex justify-end">
										{type === "image" ? (
											<div className="w-7 h-7 relative">
												<Image
													src={`${backendBase}${content}`}
													alt="Starred Image"
													fill
													className="rounded-md object-cover"
												/>
											</div>
										) : (
											<p className={`${poppins.className} text-[12px] text-gray-600 line-clamp-1 max-w-[100px] text-right`}>
												{content}
											</p>
										)}
									</div>

									{/* Date */}
									<p className="text-[11px] text-gray-400">
										{new Date(createdAt).toLocaleDateString([], {
											month: "short",
											day: "numeric",
										})}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Starred;
