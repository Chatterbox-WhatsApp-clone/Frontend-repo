"use client";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import {
	useAuthenticatedStore,
	useUserProfile,
	useUpdateUserStore,
} from "@/zustand";
import Modal from "@/app/components/Modal";

const DeleteChat = ({ setDeleteChat }) => {
	const { activeUser, setActiveUser, chatId } = useUserProfile();
	const { setUserUpdated } = useUpdateUserStore();
	const { token } = useAuthenticatedStore();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(false);

	const deleteChat = async () => {
		setLoading(true);
		if (!activeChat) return;
		const endpoint = `${process.env.NEXT_PUBLIC_CLEAR_USER_CHATS_ENDPOINT}${chatId}`;
		try {
			const res = await fetch(endpoint, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.ok) {
				setSuccess(true);
				setStatus('Chat deleted successfully');
				setTimeout(() => setDeleteChat(false), 8000);
				setActiveUser(null);
				setUserUpdated(true);
			} else {
				console.error("Failed to delete chat");
				setSuccess(false);
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};

	// create an endpoint to get the populatedlist of friends

	return (
		<>
			{status && (
				<div
					className={`top-2 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}

			<Modal>
				<div className="flex flex-col items-center bg-white shadow-lg shadow-gray-400 p-6 rounded-xl max-w-sm w-[90%]">
					<p className="text-gray-800 text-center mb-4 font-medium">
						Are you sure you want to delete this chat?.
					</p>
					<div className="flex flex-row justify-between w-full gap-3">
						<button
							onClick={() => setDeleteChat(false)}
							id="cancelBtn"
							className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2 font-semibold hover:bg-gray-300">
							Cancel
						</button>
						<button
							onClick={deleteChat}
							id="blockBtn"
							className="flex-1 bg-red-600 text-white rounded-md py-2 font-semibold hover:bg-red-700">
							{loading ? <PulseLoader /> : "Delete Chat"}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default DeleteChat;
