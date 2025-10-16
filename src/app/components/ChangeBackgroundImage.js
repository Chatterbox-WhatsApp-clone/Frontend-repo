"use client";
import React, { useState, useEffect } from "react";

const ChangeBackgroundImage = () => {
	const [activeImage, setActiveImage] = useState("Default");
	const imageTabs = ["Default", "Chats", "Marbles"];

	useEffect(() => {
		const savedImage = localStorage.getItem("chatBackground");
		if (savedImage) setActiveImage(savedImage);
	}, []);

	const saveSelectedImage = (tab) => {
		setActiveImage(tab);
		localStorage.setItem("chatBackground", tab);
	};

	return (
		<div className="bg-white h-36 w-36 rounded-lg flex flex-col gap-2 p-2">
			{imageTabs.map((tab) => (
				<button
					key={tab}
					className="bg-red-500 py-1 px-1 rounded-lg text-white"
					onClick={() => saveSelectedImage(tab)}>
					{tab}
				</button>
			))}
		</div>
	);
};


export const changeImage = () => {
	const activeImage = localStorage.getItem("chatBackground") || "Default";
	switch (activeImage) {
		case "Chats":
			return "/assets/images/chatsImage.jpg";
		case "Marbles":
			return "/assets/images/stones_background.png";
		default:
			return "/assets/images/chatBackground.jpg";
	}
};

export default ChangeBackgroundImage;
