"use client";
import React, { useState } from "react";
import {
	useAuthenticatedStore,
	useFriendsStore,
	useRemovedStore,
} from "@/zustand";
import { PulseLoader } from "react-spinners";

const AcceptFriendButton = ({ request }) => {
	const acceptEndpoint = process.env.NEXT_PUBLIC_ACCEPT_FRIEND_REQUEST;

	const { token } = useAuthenticatedStore();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("Accept");

	const { setAccepted } = useRemovedStore();
	const { addSentRequest } = useFriendsStore();

	// Send friend request
	const acceptRequest = async () => {
		setLoading(true);

		try {
			const res = await fetch(acceptEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ requestId: request._id }),
			});

			if (res.ok) {
				addSentRequest(request._id); // track locally
				setStatus("Accepted");
				setAccepted(true)
			} else {
				console.error("Failed to send request");
				setStatus("Error. Try again");
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={acceptRequest}
			disabled={loading}
			className="sm:mt-1 w-full h-7 rounded-md text-sm bg-[#ddc2ed] text-[#741ca4] hover:bg-[#d4b8e7] cursor-pointer">
			{loading ? <PulseLoader size={3} /> : status}
		</button>
	);
};

export default AcceptFriendButton;

