"use client";
import React, { useState, useEffect } from "react";
import { socket } from "@/socket";
import {
	useMessagesStore,
	useAuthenticatedStore,
	useUserProfile,
} from "@/zustand";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { generateChatId } from "@/utils/GenerateChatId";
import { Nunito } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
import Spinner from "@/Spinner";
import { useQuery } from "@tanstack/react-query";

const ChatDetails = () => {
	// useEffect connect to the web socket
	const { messages, setMessages, setMessageStatus, messageStatus } =
		useMessagesStore();
	const { userId, token } = useAuthenticatedStore();
	// handle typing
	const { activeUser } = useUserProfile();
	const [typing, setTyping] = useState(false);
	// Use chatId from activeUser if available, otherwise generate one
	const chatId = activeUser?.chatId || generateChatId(userId, activeUser?._id);

	useEffect(() => {
		if (!socket || !chatId) return;

		socket.on("message_sent", (data) => {
			setMessageStatus("sent");
			setMessages(data.message);
		});

		socket.on("message_delivered", ({ messageId }) => {
			setMessageStatus("delivered");
		});

		socket.on("new_message", (data) => {
			setMessages(data.message);
		});

		socket.on("message_read", () => {
			setMessageStatus("read");
		});

		socket.on("user_typing", ({ isTyping }) => {
			setTyping(isTyping);
		});

		return () => {
			socket.off("message_sent");
			socket.off("message_delivered");
			socket.off("new_message");
			socket.off("message_read");
			socket.off("user_typing");
		};
	}, [chatId, setMessages, setMessageStatus]);

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

	const { data, isLoading } = useQuery({
		queryKey: ["chat_messages", chatId],
		queryFn: fetchUserChats,
		staleTime: 50,
		cacheTime: 50,
	});

	useEffect(() => {
		if (data?.data) {
			setMessages(data?.data);
		}
	}, [data]);

	return (
		<>
			<div className="px-3 w-full flex flex-col gap-1 overflow-y-auto mt-2">
				{isLoading ? (
					<div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
						<Spinner className="w-12 h-12 animate-spin text-blue-500 mb-4" />
						<p className="text-gray-700 text-lg font-medium">
							Loading chats...
						</p>
					</div>
				) : (
					messages?.map((msg) => {
						return (
							<div
								className={`flex ${
									msg.sender._id === userId ? "justify-end" : "justify-start"
								}  mt-[2px]`}
								key={`${msg._id}`}>
								<div
									className={`py-[3px] flex space-y-1 px-2 rounded-lg break-words w-auto md:max-w-[65%] shadow-2xl ${
										msg.sender._id === userId
											? "bg-[#7304af] text-white"
											: "bg-white text-black"
									}
								`}>
									<p className={`text-sm text-start ${nunito.className}`}>
										{msg.content?.text}
									</p>

									<div className="flex justify-end items-end space-x-1 mt-[1px] text-[9px] ml-4 shrink-0">
										<p
											className={`${
												msg.sender._id === userId
													? "text-gray-300"
													: "text-gray-500"
											}font-semibold`}>
											{new Date(msg.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
										{msg.sender._id === userId && (
											<div>
												{messageStatus === "sent" && (
													<p className="text-gray-300">✓</p>
												)}
												{messageStatus === "delivered" && (
													<p className="text-gray-300">✓✓</p>
												)}
												{messageStatus === "read" && (
													<p className="text-white">✓✓</p>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})
				)}
				{/* Typing animation */}
				{typing && (
					<div className="flex items-center justify-start gap-2 mt-1 fixed bottom-14 left-2">
						<div className="bg-black px-2 rounded-md relative w-auto py-[1px]">
							<BiDotsHorizontalRounded className="text-white text-xl animate-typingDots" />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ChatDetails;

// chats top for user_online and offline to show whether user is online or not
// when the user clicks on arrow send leave_chat and socket.disconnect

// chats is to fetch all chats for a user

// save the message id from the messages array so that you can edit and delete

{
	/**{chatId: '6902025d7cb761fc698ea42b', message: {…}}chatId: "6902025d7cb761fc698ea42b"message: chat: "6902025d7cb761fc698ea42b"content: {text: 'Big man'}createdAt: "2025-10-30T16:44:15.944Z"deletedBy: []deliveredTo: []forwardedFrom: {forwardedAt: '2025-10-30T16:44:15.945Z'}isDeleted: falsereactions: []readBy: []sender: {_id: '68c1b5fc7773252c43b20472', username: 'Chibueze', profilePicture: '/uploads/profilePics/1757525564319-542298099.jpg', totalContacts: 0, totalBlocked: 0, …}fullName: "Chibueze"id: "68c1b5fc7773252c43b20472"profilePicture: "/uploads/profilePics/1757525564319-542298099.jpg"totalBlocked: 0totalContacts: 0username: "Chibueze"_id: "68c1b5fc7773252c43b20472"[[Prototype]]: Objectstatus: "sent"type: "text"updatedAt: "2025-10-30T16:44:15.946Z"__v: 0_id: "690395df1ae8f768f4ea44dd"[[Prototype]]: Object[[Prototype]]: Object
turbopack-hot-reloader-common.ts:41 [Fast Refresh]   */
}
