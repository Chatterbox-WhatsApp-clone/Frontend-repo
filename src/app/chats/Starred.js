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
import {
	FaRegImage,
	FaRegFileVideo,
	FaRegFile,
} from "react-icons/fa";

const Starred = ({ setActiveTab }) => {
	const { token, userId } = useAuthenticatedStore();
		const { setActiveChat, setChatId } =
			useUserProfile();
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

	const getMediaPreview = (mimeType, filename) => {
		if (!mimeType) return { icon: <FaRegFile />, label: filename || "File" };

		if (mimeType.startsWith("image/")) {
			return { icon: <FaRegImage />, label: "Image" };
		}

		if (mimeType.startsWith("video/")) {
			return { icon: <FaRegFileVideo />, label: "Video" };
		}

		return { icon: <FaRegFile />, label: filename || "File" };
	};

	return (
		<div className="h-full relative flex flex-col justify-start items-center overflow-y-auto w-full noscroll">
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
				<div className="flex flex-col justify-center items-center gap-3 relative mt-44 ">
					<p
						className={`${poppins.className}  text-wrap text-center text-sm font-mono`}>
						You have no starred messages. Star messages to see them here.
					</p>
				</div>
			) : (
				<div className="flex flex-col h-full justify-start items-center w-full mt-1 px-1 ">
					{data?.data?.map((item) => {
						const messages = item?.content;
						const message = messages?.text;
						const media = messages?.media;
						const type = media?.mimeType;
						const fileName = media?.filename;
						const url = item?.content?.media?.url
							? `${backendBase}${item.content.media.url}`
							: "";

						const createdAt = item?.createdAt;
						const sender = item?.user;

						const username =
							sender?.username || sender?.phoneNumber || sender?.fullName;

						const preview = getMediaPreview(type, fileName);
						return (
							<div
								className="w-full h-auto py-2 px-3 border-b border-b-gray-200 cursor-pointer hover:bg-gray-50 flex flex-row justify-between items-start overflow-y-auto"
								key={item._id}
								onClick={() => {
									setOpenMessage(true);
									setActiveChat(item);
									setChatId(item?.chatId);
								}}>
								{/* LEFT SIDE */}
								<div className="flex flex-col justify-start items-start gap-1 max-w-[70%]">
									<p className="font-bold text-sm text-gray-900 truncate">
										{username}
									</p>

									{url ? (
										<p
											className={`flex items-center space-x-2 
														${poppins.className}
													 text-[12px] text-gray-800 truncate`}>
											{preview.icon}
											<span>{preview.label}</span>
										</p>
									) : (
										<p
											className={`text-[12px] text-gray-800 truncate ${poppins.className}`}>
											{message?.length > 25
												? message.slice(0, 25) + "..."
												: message}
										</p>
									)}
								</div>

								{/* RIGHT SIDE */}
								<div className="flex flex-col justify-end items-end gap-1">
									{url && (
										<Image
											src={url}
											width={100}
											height={100}
											alt="Starred"
											className="w-[60px] h-[60px] rounded-md object-cover object-center"
										/>
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
