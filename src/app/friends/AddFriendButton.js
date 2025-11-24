"use client";
import React, { useState } from "react";
import {
	useAuthenticatedStore,
	useRequestedId,
	useFriendsStore,
} from "@/zustand";
import { PulseLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";

const AddFriendButton = ({ user, friend }) => {
	const endpoint = process.env.NEXT_PUBLIC_SEND_FRIEND_REQUEST;
	const rejectEndpoint = process.env.NEXT_PUBLIC_CANCEL_FRIEND_REQUEST;

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

	// Determine the actual ID to use
	const actualId = user?._id || friend;

	const status = getLocalStatus(actualId);
	const userStatus = status === "not sent";

	// Send friend request
	const queryClient = useQueryClient();
	const sendRequest = async () => {
		setLoading(true);
		setUserRequestedId(actualId);

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ receiverId: actualId }),
			});

			if (res.ok) {
				addSentRequest(actualId);
				setLocalStatus(actualId, "pending");
				setTimeout(async () => {
					await queryClient.invalidateQueries(["all-friends"]);
				}, 5000);
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
		setUserRequestedId(actualId);

		try {
			const res = await fetch(rejectEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ receiverId: actualId }),
			});

			if (res.ok) {
				setLocalStatus(actualId, "not sent");
				removeSentRequest(actualId);
				addRemovedFriend(actualId);
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
					className="sm:mt-1 w-full h-7 rounded-md text-sm bg-[#460668] text-white hover:bg-[#8c17da] cursor-pointer">
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
