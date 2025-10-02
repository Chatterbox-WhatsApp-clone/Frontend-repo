"use client"
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useAuthenticatedStore } from "@/zustand";
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { autoConnect: false });

const FetchUser = () => {
	const userEndpoint = process.env.NEXT_PUBLIC_GET_USER_ENDPOINT;
	const { token, userId, setUserId } = useAuthenticatedStore();

	// // Fetch user profile
	// const fetchUserInfo = async () => {
	// 	const res = await fetch(userEndpoint, {
	// 		method: "GET",
	// 		headers: { Authorization: `Bearer ${token}` },
	// 	});
	// 	if (!res.ok) throw new Error("Failed to fetch user");
	// 	return res.json();
	// };

	// const { data } = useQuery({
	// 	queryKey: ["users"],
	// 	queryFn: fetchUserInfo,
	// 	enabled: !!token,
	// 	staleTime: 300_000,
	// 	cacheTime: 300_000,
	// });

	// useEffect(() => {
	// 	if (data?.data?._id && token) {
	// 		setUserId(userId);

	// 		// Connect socket
	// 		socket.connect();

	// 		// Authenticate socket
	// 		socket.emit("authenticate", { userId, token });

	// 		socket.on("authenticated", () => {
	// 			console.log("✅ Socket authenticated");
	// 		});

	// 		socket.on("authentication_error", (err) => {
	// 			console.error("❌ Socket auth failed:", err);
	// 		});

	// 		// Listen for other users online/offline
	// 		socket.on("user_online", ({ userId }) => {
	// 			console.log("👤 User online:", userId);
	// 		});

	// 		socket.on("user_offline", ({ userId }) => {
	// 			console.log("👤 User offline:", userId);
	// 		});

	// 		// Emit current user online status every time the profile is fetched
	// 		socket.emit("user_status", { userId, status: "online" });

	// 		// Cleanup on unmount
	// 		return () => {
	// 			if (userId) {
	// 				socket.emit("user_status", { userId, status: "offline" });
	// 			}
	// 			socket.disconnect();
	// 		};
	// 	}
	// }, [data, token, setUserId]);

	return null; // doesn't render anything
};

export default FetchUser;
