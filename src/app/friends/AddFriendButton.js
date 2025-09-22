"use client";
import React, { useState } from "react";
import { useAuthenticatedStore, useRequestedId } from "@/zustand";

const AddFriendButton = ({ removed }) => {
	const endpoint = process.env.NEXT_PUBLIC_SEND_FRIEND_REQUEST;
	const { token } = useAuthenticatedStore();
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const { userRequestedId } = useRequestedId();

	const sendRequest = async (e) => {
		e.preventDefault();
		if (sent || loading) return;
		setLoading(true);
        console.log(userRequestedId)
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					receiverId: userRequestedId,
				}),
			});

			if (res.ok) {
				setSent(true);
			} else {
				console.error("Failed to send request");
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={sendRequest}
			disabled={sent || removed}
			className={`sm:mt-1 w-full h-7 rounded-md text-sm transition ${
				removed
					? "bg-gray-300 text-gray-500 cursor-default"
					: sent
					? "bg-gray-300 text-gray-700 cursor-default"
					: "bg-[#ddc2ed] text-[#741ca4] hover:bg-[#d4b8e7]"
			}`}>
			{removed ? "Removed" : sent ? "Sent" : "Add Friend"}
		</button>
	);
};

export default AddFriendButton;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGMxYjVmYzc3NzMyNTJjNDNiMjA0NzIiLCJpYXQiOjE3NTc1MjU1MDB9.QZ7dvYGd3Q5kiPbH_Rf4iW28AiZUnitJfpPHV283hic"

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGMxYzJmMDJkN2U1YTExM2Q1NjQ0OTEiLCJpYXQiOjE3NTc1Mjg4MTd9.AXuHVLvZ6O-3XrnPBmo2wo2nSHUy4yyuw2FFtCQ5byQ