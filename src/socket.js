// socket.js
import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export const socket = io(URL, {
	withCredentials: true,
	transports: ["websocket"],
});
