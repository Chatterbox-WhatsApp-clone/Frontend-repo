"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import {
	useAuthenticatedStore,
	useUserProfile,
	useClickedStore,
} from "@/zustand";
import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Unread = ({ searchQuery = "", setActiveTab }) => {
	const { token } = useAuthenticatedStore();
	const { activeUser, setActiveUser } = useUserProfile();
	const { setOpenMessage } = useClickedStore();
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const onlineEndpoint = process.env.NEXT_PUBLIC_GET_USER_UNREADCHATS_ENDPOINT;

	const fetchUsers = async () => {
		const res = await fetch(onlineEndpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data } = useQuery({
		queryKey: ["users-unreadchat"],
		queryFn: fetchUsers,
		staleTime: 100000,
		cacheTime: 300000,
	});

	// Filter chats with unread messages and apply search filter

	return (
		<div className="h-full relative flex flex-col justify-start items-center overflow-y-auto w-full noscroll">
			<div className="w-full hidden md:flex flex-row items-center justify-start gap-2 p-2 border-b border-gray-200 mt-32">
				<IoIosArrowForward
					className="text-xl cursor-pointer rotate-180"
					onClick={() => setActiveTab("All")}
				/>
				<h2 className={`${poppins.className} font-bold text-lg`}>
					Unread Chats
				</h2>
			</div>
			{data?.data?.length === 0 ? (
				<div className="flex flex-col justify-center items-center gap-3 relative mt-44">
					<p
						className={`${poppins.className}  text-wrap text-center text-sm font-mono`}>
						You have no unread messages. All caught up!
					</p>
				</div>
			) : (
				<div className="flex flex-col h-full justify-start items-center w-full mt-1 px-1">
					{data?.data?.map((chat) => {
						const profilePicture = chat?.user?.profilePicture
							? `${backendBase}${chat?.user?.profilePicture}`
							: "/assets/images/friendImage.jpg";

						return (
							<div
								className={`h-[70px] w-full py-1 shrink-0 cursor-pointer ${
									activeUser?.chatId === chat?.chatId
										? "bg-gray-200"
										: "bg-transparent"
								} hover:bg-gray-200 px-1 cursor-pointer`}
								key={chat?.chatId}
								onClick={() => {
									setOpenMessage(true);
									setActiveUser(chat);
									// setChatId(chat?.chatId);
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
																return "";
															}
														})()}
													</p>
													{chat?.unreadCount > 0 && (
														<span className="w-[14px] h-[14px] rounded-full bg-[#7304af] text-[11px] font-bold text-white flex justify-center items-center ml-auto">
															{chat?.unreadCount}
														</span>
													)}
												</div>
											</div>

											<p
												className={`${
													poppins.className
												} text-gray-700 text-[12px] ${
													chat?.unreadCount > 0 ? "-mt-2" : ""
												}`}>
												{chat?.lastMessage?.content?.text?.length > 30
													? chat.lastMessage.content.text.slice(0, 30) + "..."
													: chat?.lastMessage?.content?.text}
											</p>
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

export default Unread;
