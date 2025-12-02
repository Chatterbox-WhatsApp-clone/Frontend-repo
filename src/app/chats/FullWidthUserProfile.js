"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Spinner from "@/Spinner";
import {
	useAuthenticatedStore,
	useUserProfile,
	useClickedStore,
} from "@/zustand";
import { useQuery } from "@tanstack/react-query";
import { Nunito } from "next/font/google";
import MessageActions from "./MessageAction";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

const FullWidthUserProfile = () => {
	const { token, userId } = useAuthenticatedStore();
	const { chatId, setActiveMessage, setMyMessage, setMessageId } =
		useUserProfile();
	const [openMessageMenu, setOpenMessageMenu] = useState(false);

	const fetchUserChats = async () => {
		const endpoint = process.env.NEXT_PUBLIC_GET_MESSAGES.replace(
			"{chatId}",
			chatId
		);
		try {
			const res = await fetch(endpoint, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return res.json();
		} catch (error) {
			console.log("Error fetching data", error);
		}
	};

	const { data, isLoading, isError } = useQuery({
		queryKey: ["all_messages"],
		queryFn: fetchUserChats,
		staleTime: 300000,
		cacheTime: 300000,
	});

	return (
		<>
			<div className="h-[87vh] md:h-[83vh] flex flex-col overflow-y-auto noscroll px-2 pt-3 pb-10 z-0 ">
				{isLoading ? (
					<div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
						<Spinner className="w-12 h-12 animate-spin text-blue-500 mb-4" />
						<p className="text-gray-700 text-lg font-medium">
							Loading chats...
						</p>
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center w-full h-full">
						<div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md shadow-md">
							<p className="font-semibold text-lg">
								Oops! Something went wrong.
							</p>
							<p className="text-sm mt-1">Please try again later.</p>
						</div>
					</div>
				) : data?.data?.length < 1 ? (
					<div className="flex items-center justify-center w-full h-full">
						<p className="text-gray-500 text-lg font-medium">No chats found.</p>
					</div>
				) : (
					<div className="flex flex-col gap-[6px]">
						{data?.data?.map((chat) => {
							const isMe = chat?.sender?._id === userId;
							const message = chat?.content?.text;
							const createdAt = chat?.createdAt;
							const status = chat?.status;

							return (
								<div
									key={chat?._id}
									className={`flex ${
										isMe ? "justify-end" : "justify-start"
									} mt-[2px] relative cursor-pointer`}
									onClick={() => {
										setOpenMessageMenu(true);
										setActiveMessage(chat?.content?.text);
										setMessageId(chat?._id);
									}}>
									<div
										className={`py-[3px] flex space-y-1 px-2 rounded-lg break-words w-auto max-w-[65%] shadow-2xl ${
											isMe ? "bg-[#7304af] text-white" : "bg-white text-black"
										}`}
										onClick={() => setMyMessage(isMe)}>
										<p className={`text-sm text-start ${nunito.className}`}>
											{message}
										</p>

										<div className="flex justify-end items-end space-x-1 mt-[1px] text-[9px] ml-4 shrink-0">
											{chat?.starredBy?.includes(userId) && (
												<FaStar
													className={`text-[10px] mb-[2px] cursor-pointer ${
														isMe ? "text-white" : "text-[#7304af]"
													}`}
													onClick={(e) => {
														e.stopPropagation();
														fetch(process.env.NEXT_PUBLIC_UNSTAR_MESSAGE, {
															method: "POST",
															headers: {
																"Content-Type": "application/json",
																Authorization: `Bearer ${token}`,
															},
															body: JSON.stringify({ messageId: chat._id }),
														}).catch((err) => console.error(err));
													}}
												/>
											)}

											<p
												className={`${
													isMe ? "text-gray-300" : "text-gray-500"
												} font-semibold`}>
												{new Date(createdAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>

											{isMe && (
												<div>
													{status === "sent" && (
														<p className="text-gray-300">✓</p>
													)}
													{status === "delivered" && (
														<p className="text-gray-300">✓✓</p>
													)}
													{status === "read" && (
														<p className="text-white">✓✓</p>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{openMessageMenu && (
				<MessageActions setOpenMessageMenu={setOpenMessageMenu} />
			)}
		</>
	);
};

export default FullWidthUserProfile;
