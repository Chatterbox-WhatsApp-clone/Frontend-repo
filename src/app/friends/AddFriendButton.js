"use client";
import React, { useEffect, useState } from "react";
import {
	useAuthenticatedStore,
	useRequestedId,
	useFriendsStore,
} from "@/zustand";
import { PulseLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";

const AddFriendButton = ({ user }) => {
	const endpoint = process.env.NEXT_PUBLIC_SEND_FRIEND_REQUEST;
	const rejectEndpoint = process.env.NEXT_PUBLIC_CANCEL_FRIEND_REQUEST;
	const queryClient = useQueryClient();

	const { token } = useAuthenticatedStore();
	const { setUserRequestedId } = useRequestedId();

	const {
		addSentRequest,
		removeSentRequest,
		addRemovedFriend,
		setLocalStatus,
		getLocalStatus,
	} = useFriendsStore();

	const [loading, setLoading] = useState(false);
	// setting local status to the user's status
	const status = getLocalStatus(user._id);
	const userStatus = status === "not sent";
	// setting local status to the user's status

	// Send friend request
	const sendRequest = async () => {
		setLoading(true);
		setUserRequestedId(user._id);

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ receiverId: user._id }),
			});

			if (res.ok) {
				addSentRequest(user._id);
				setLocalStatus(user._id, "pending");
			} else {
				console.error("Failed to send request");
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};

	// Cancel request
	const removeFriend = async () => {
		if (loading) return;
		setLoading(true);
		setUserRequestedId(user._id);

		try {
			const res = await fetch(rejectEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ receiverId: user._id }),
			});

			if (res.ok) {
				setLocalStatus(user._id, "not sent");
				removeSentRequest(user._id);
				addRemovedFriend(user._id);
			} else {
				console.error("Failed to cancel friend request");
			}
		} catch (err) {
			console.error("Error removing friend:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{userStatus ? (
				<button
					onClick={sendRequest}
					disabled={loading}
					className="sm:mt-1 w-full h-7 rounded-md text-sm bg-[#ddc2ed] text-[#741ca4] hover:bg-[#d4b8e7] cursor-pointer">
					{loading ? <PulseLoader size={3} /> : "Add Friend"}
				</button>
			) : (
				<button
					onClick={removeFriend}
					disabled={loading}
					className="sm:mt-1 w-full h-7 rounded-md text-sm bg-gray-300 text-gray-500 cursor-pointer">
					{loading ? <PulseLoader size={3} /> : "Cancel Request"}
				</button>
			)}
		</>
	);
};

export default AddFriendButton;
