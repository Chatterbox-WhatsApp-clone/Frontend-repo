"use client";
import React, { useState } from "react";
import { useAuthenticatedStore, useFriendsStore } from "@/zustand";
import { PulseLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CancelFriend = ({ request }) => {
	const rejectEndpoint = process.env.NEXT_PUBLIC_CANCEL_FRIEND_REQUEST;
	const { token } = useAuthenticatedStore();
	const { removeSentRequest, setLocalStatus } = useFriendsStore();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("Cancel Request");
	const queryClient = useQueryClient();

	// mutation for canceling request
	const cancelMutation = useMutation({
		mutationFn: async () => {
			return await fetch(`${rejectEndpoint}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ receiverId: request.receiver._id }),
			});
		},
		onSuccess: async (res) => {
			if (res.ok) {
				setStatus("Request Canceled");
				setLocalStatus(request.receiver._id, "not sent");
				removeSentRequest(request._id);
				setTimeout(async () => {
					await queryClient.invalidateQueries(["all-available-friends"]);
				}, 5000);
			} else {
				console.error("Failed to cancel friend request");
			}
		},
		onSettled: () => {
			setLoading(false);
		},
	});

	const removeFriend = async () => {
		if (loading) return;
		setLoading(true);
		cancelMutation.mutate();
	};

	const timeAgo = (dateString) => {
		const now = new Date();
		const past = new Date(dateString);
		const diffMs = now - past;

		const seconds = Math.floor(diffMs / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (seconds < 60) return `${seconds}s ago`;
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	};

	const accepted = request.status === "accepted";

	return (
		<div className="flex flex-col w-full">
			{/* <p className="text-xs text-gray-600 text-end"> {timeAgo(request.createdAt)} </p> */}
			{accepted ? (
				<button
					disabled={accepted}
					className="w-full h-8 rounded-md text-sm bg-gray-300 cursor-pointer">
					Accepted
				</button>
			) : (
				<button
					onClick={removeFriend}
					disabled={loading}
					className="w-full flex justify-center items-center h-8 rounded-md text-sm bg-gray-300 cursor-pointer">
					{loading ? <PulseLoader size={3} /> : status}
				</button>
			)}
		</div>
	);
};

export default CancelFriend;
