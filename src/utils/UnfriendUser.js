"use client";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import {
	useAuthenticatedStore,
	useUserProfile,
	useUpdateUserStore,
} from "@/zustand";
import Modal from "@/app/components/Modal";
const UnfriendUser = ({ setUnfriendModal }) => {
	const { activeUser, setActiveUser } = useUserProfile();
	const { setUserUpdated } = useUpdateUserStore();

	const userId = activeUser?._id;
	const endpoint = process.env.NEXT_PUBLIC_REMOVE_FRIEND.replace(
		"{friendId}",
		userId
	);
	const { token } = useAuthenticatedStore();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(false);
	// function to block

	const unFriendUser = async () => {
		setLoading(true);
		try {
			const res = await fetch(endpoint, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();

			if (res.ok) {
				setSuccess(true);
				setStatus(
					data?.message ||
						`${activeUser?.username} has been removed as your friend`
				);

				setTimeout(() => setUnfriendModal(false), 5000);
				setActiveUser(null);
				setUserUpdated(true);
			} else {
				console.error("Failed to block User");
				setSuccess(false);
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};
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
				<div className="flex flex-col items-center bg-white shadow-lg shadow-gray-400 p-6 rounded-xl max-w-sm w-[90%] justify-center ">
					<p className="text-gray-800 text-center mb-4 font-medium">
						Are you sure you want to unfriend {activeUser?.username}? All chats
						and media with them will be permanently removed.
					</p>

					<div className="flex flex-row justify-between w-full gap-3">
						<button
							onClick={() => setUnfriendModal(false)}
							id="cancelBtn"
							className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2 font-semibold hover:bg-gray-300">
							Cancel
						</button>
						<button
							onClick={unFriendUser}
							id="blockBtn"
							className="flex-1 bg-red-600 text-white rounded-md py-2 font-semibold hover:bg-red-700">
							{loading ? <PulseLoader /> : "Unfriend"}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default UnfriendUser;
