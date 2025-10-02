import React from "react";
import { useClickedStore } from "@/zustand";
const Messages = () => {
    const {clicked} = useClickedStore()
	return (
		<div
			className={`messages h-full md:ml-2 md:grid-cols-2 md:block ${
				clicked ? "block" : "hidden"
			}`}>
			<h1>Welcome to chatterbox</h1>
		</div>
	);
};

export default Messages;
