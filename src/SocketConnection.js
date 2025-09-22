import React from "react";
import { useEffect } from "react";
import { socket } from "./socket";
import { useAuthenticatedStore } from "@/zustand"; // example

const SocketConnection = () => {
	const { userId, token } = useAuthenticatedStore();

	useEffect(() => {
		if ((userId, token)) {
			socket.connect();

		    socket.emit("authenticate", {
				userId: userId,
				token: token,
			});

			socket.on("authenticated", (data) => {
				console.log("✅ Socket authenticated", data);
			});

			socket.on("authentication_error", (err) => {
				console.error("❌ Socket auth failed:", err);
			});

			socket.on("user_online", ({ userId }) => {
				console.log("👤 User online:", userId);
			});

			socket.on("user_offline", ({ userId }) => {
				console.log("👤 User offline:", userId);
			});
		}
	}, [token, userId]);
	return;
};

export default SocketConnection;
