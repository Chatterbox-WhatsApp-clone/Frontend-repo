"use client";
import React, { useState } from "react";
import { useAuthenticatedStore, useRequestedId } from "@/zustand";

const RemoveFriendButton = ({ removed, setRemoved }) => {
	const endpoint = process.env.NEXT_PUBLIC_REJECT_FRIEND_REQUEST;
	const { token } = useAuthenticatedStore();
	const [loading, setLoading] = useState(false);
	const { userRequestedId } = useRequestedId();

	const removeFriend = async (e) => {
		e.preventDefault();
		if (removed || loading) return;
		setLoading(true);

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ requestId: userRequestedId }),
			});

			if (res.ok) {
				setRemoved(true);
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
		<button
			onClick={removeFriend}
			disabled={loading}
			className={`sm:mt-1 w-full h-7 rounded-md text-sm font-medium ${
				removed
					? "bg-gray-200 text-gray-500 cursor-default"
					: "bg-gray-300 text-black hover:bg-gray-400"
			}`}>
			{loading ? "Removing..." : removed ? "Removed" : "Remove"}
		</button>
	);
};

export default RemoveFriendButton;
