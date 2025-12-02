"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import {
	useAuthenticatedStore,
	useUserProfile,
	useClickedStore,
} from "@/zustand";
import Image from "next/image";

import { IoIosArrowForward } from "react-icons/io";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Starred = ({ setActiveTab }) => {
	const { token, userId } = useAuthenticatedStore();
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
		staleTime: 10000,
		cacheTime: 30000,
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
				<div className="flex flex-col justify-center items-center gap-3 relative mt-32 md:mt-44 ">
					<p
						className={`${poppins.className}  text-wrap text-center text-sm font-mono`}>
						You have no starred messages. Star messages to see them here.
					</p>
				</div>
			) : (
				<div className="flex flex-col h-full justify-start items-center w-full mt-1 px-1">
					{data?.data?.map((item) => {
						const messages = item?.messages || [];
						const message = messages[0]; // FIRST message
						const type = message?.type;
						const content = message?.content;
						const createdAt = message?.createdAt;
						const sender = item?.user;

						const username =
							sender?.username || sender?.phoneNumber || "Unknown";

						// PREVIEW
						let preview = "";
						let mediaUrl = null;

						if (type === "text") {
							preview = content?.text || "";
						} else if (type === "image") {
							mediaUrl = `${backendBase}${content?.media?.url}`;
							preview = "Image";
						} else if (
							type === "video" ||
							type === "audio" ||
							type === "voice"
						) {
							preview = type.toUpperCase();
						}

						return (
							<div
								className="w-full py-2 px-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex flex-row justify-between items-start overflow-hidden"
								key={item.chatId}
								onClick={() => {
									setOpenMessage(true);
									setActiveUser({
										...item,
										jumpToMessageId: message?._id, // first message id
									});
								}}>
								{/* LEFT SIDE */}
								<div className="flex flex-col justify-start items-start gap-1 max-w-[70%]">
									<p className="font-bold text-sm text-gray-900 truncate">
										{username}
									</p>

									{type === "image" ? (
										<p className="text-[12px] text-gray-500">{preview}</p>
									) : (
										<p className="text-[14px] text-gray-800 truncate">
											{preview?.length > 25
												? preview.slice(0, 25) + "..."
												: preview}
										</p>
									)}
								</div>

								{/* RIGHT SIDE */}
								<div className="flex flex-col justify-end items-end gap-1">
									{/* IMAGE PREVIEW */}
									{type === "image" && mediaUrl && (
										<div className="w-7 h-7 relative">
											<Image
												src={mediaUrl}
												alt="Starred"
												fill
												className="rounded-md object-cover"
											/>
										</div>
									)}
									{/* DATE */}
									<p className="text-[11px] text-gray-800">
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
