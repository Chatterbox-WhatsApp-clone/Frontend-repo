import React from "react";
import { createPortal } from "react-dom";

const FriendOptions = () => {
	return createPortal(
		<div className="fixed bottom-0 sm:top-full left-0 z-50 flex items-center justify-center bg-white h-48 w-48 rounded-md shadow-lg w-full">
			<button className="px-4 py-2 bg-blue-500 text-white rounded">
				Toggle
			</button>
		</div>,
		document.body
	);
};

export default FriendOptions;
