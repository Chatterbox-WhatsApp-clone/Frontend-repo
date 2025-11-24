"use client";
import React, { use, useState } from "react";
import {
	useAuthenticatedStore,
	useFriendsStore,
	useRemovedStore,
} from "@/zustand";
import { PulseLoader } from "react-spinners";

const RemoveFriendButton = ({ user }) => {
	const { token } = useAuthenticatedStore();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("Remove");
	const endpoint = process.env.NEXT_PUBLIC_TEMPREMOVE_FRIEND.replace(
		"{friendId}",
		String(user?._id)
	);
	const { setRemoved } = useRemovedStore();
	const { getLocalStatus } = useFriendsStore();
	const userStatus = getLocalStatus(user?._id) === "not sent"

	const removeFriend = async (e) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);

		try {
			const res = await fetch(endpoint, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.ok) {
				setRemoved(true);
				setStatus("Removed");
			} else {
				console.error("Failed to remove friend");
			}
		} catch (err) {
			console.error("Error removing friend:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{userStatus && (
				<button
					onClick={removeFriend}
					disabled={loading}
					className={`sm:mt-1 w-full h-7 rounded-md text-sm font-medium bg-gray-300 text-black hover:bg-gray-400 cursor-pointer`}>
					{loading ? <PulseLoader size={3} /> : status}
				</button>
			)}
		</>
	);
};

export default RemoveFriendButton;
