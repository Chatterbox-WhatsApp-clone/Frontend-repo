"use client";
import React, { useState } from "react";
import {
	useAuthenticatedStore,
	useFriendsStore,
	useRemovedStore,
} from "@/zustand";
import { PulseLoader } from "react-spinners";

const RejectFriendButton = ({ request }) => {
	const rejectEndpoint = process.env.NEXT_PUBLIC_REJECT_FRIEND_REQUEST;
	const [loading, setLoading] = useState(false);
	const { accepted, setRemoved } = useRemovedStore();

	const { token } = useAuthenticatedStore();
	const { removeSentRequest } = useFriendsStore();
	const [status, setStatus] = useState("Reject");

	// Send friend request
	const sendRequest = async () => {
		setLoading(true);
		try {
			const res = await fetch(rejectEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ requestId: request._id }),
			});

			if (res.ok) {
				removeSentRequest(request._id);
				setStatus("Rejected");
				setRemoved(true);
			} else {
				setStatus("Error. Try again");
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{!accepted && (
				<button
					onClick={sendRequest}
					disabled={loading}
					className="sm:mt-1 w-full h-7 rounded-md text-sm bg-gray-300  cursor-pointer w-full">
					{loading ? <PulseLoader size={3} /> : status}
				</button>
			)}
		</>
	);
};

export default RejectFriendButton;
