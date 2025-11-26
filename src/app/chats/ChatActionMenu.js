import React, { useEffect, useState, useRef } from "react";
import { TbUserCancel } from "react-icons/tb";
import { RiUserUnfollowLine } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { AiOutlineClear } from "react-icons/ai";
import { Nunito } from "next/font/google";

import DeleteChat from "../components/DeleteChat";
import ClearMessages from "../components/ClearMessages";

import { useAuthenticatedStore, useUserProfile } from "@/zustand";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

import BlockUser from "@/utils/BlockUser";
import UnfriendUser from "@/utils/UnfriendUser";

const ChatActionMenu = ({ setActionMenu }) => {
	const [showBlock, setBlockModal] = useState(false);
	const [showUnfriend, setUnfriendModal] = useState(false);
	const [clearMessages, setClearMessages] = useState(false);
	const [deleteChat, setDeleteChat] = useState(false);

	const dropdownRef = useRef(null);

	const { chatId, isFavourites, setIsFavourites } = useUserProfile();
	const { token } = useAuthenticatedStore();

	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(false);

	// FIX: you forgot to declare loading state
	const [loading, setLoading] = useState(false);

	const addChatToFavourites = async () => {
		setLoading(true);
		if (!chatId) return;

		const endpoint = process.env.NEXT_PUBLIC_ADD_FAVORITE_CHAT;

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ chatId: chatId }),
			});

			if (res.ok) {
				setSuccess(true);
				setStatus("Added to favorites");
				setIsFavourites(true);
				setTimeout(() => {
					setStatus("");
				}, 5000);
			} else {
				setSuccess(false);
				setStatus("Failed to add to favorites");
				setTimeout(() => {
					setStatus("");
				}, 5000);
			}
		} catch (err) {
			console.error("Error sending request:", err);
			setSuccess(false);
			setStatus("Error adding to favorites");
		} finally {
			setLoading(false);
		}
	};

	const removeChatFromFavourites = async () => {
		setLoading(true);
		if (!chatId) return;

		
		const addEndpoint = process.env.NEXT_PUBLIC_ADD_FAVORITE_CHAT;
		const endpoint = `${addEndpoint}/${chatId}`;

		try {
			const res = await fetch(endpoint, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.ok) {
				setSuccess(true);
				setStatus("Removed from favorites");
				setIsFavourites(false);
				setTimeout(() => {
					setStatus("");
				}, 5000);
			} else {
				setSuccess(false);
				setStatus("Failed to remove from favorites");
				setTimeout(() => {
					setStatus("");
				}, 5000);
			}
		} catch (err) {
			console.error("Error sending request:", err);
			setSuccess(false);
			setStatus("Error removing from favorites");
		} finally {
			setLoading(false);
		}
	};

	const chatIsFavourites = isFavourites
		? "Remove from favorites"
		: "Add to favorites";

	const handleFavoriteClick = () => {
		if (isFavourites) {
			removeChatFromFavourites();
		} else {
			addChatToFavourites();
		}
	};

	const chatActions = [
		{
			id: "block",
			label: "Block Contact",
			icon: <TbUserCancel />,
			onClick: () => setBlockModal(true),
		},
		{
			id: "unfriend",
			label: "Unfriend User",
			icon: <RiUserUnfollowLine />,
			onClick: () => setUnfriendModal(true),
		},
		{
			id: "clear",
			label: "Clear Messages",
			icon: <AiOutlineClear />,
			onClick: () => setClearMessages(true),
		},
		{
			id: "delete",
			label: "Delete Chat",
			icon: <HiOutlineTrash />,
			onClick: () => setDeleteChat(true),
		},
		{
			id: "favorites",
			label: chatIsFavourites,
			icon: isFavourites ? <IoIosHeart /> : <IoIosHeartEmpty />,
			onClick: handleFavoriteClick,
		},
	];

	// --------------------------
	// CLOSE DROPDOWN ON OUTSIDE CLICK
	// --------------------------
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setActionMenu(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			{/* STATUS TOAST */}
			{status && (
				<div
					className={`fixed top-4 left-1/2 -translate-x-1/2 text-white 
            h-10 flex justify-center items-center w-[310px] 
            z-50 text-base mx-auto rounded-md 
            ${!success ? "bg-red-600" : "bg-green-600"}`}>
					{status}
				</div>
			)}

			<div className="fixed inset-0 bg-transparent z-40"></div>

			{/* ACTION MENU */}
			<div
				ref={dropdownRef}
				className="fixed right-3 top-14 md:top-12 z-50 bg-gray-100 shadow rounded-md p-1 flex flex-col space-y-2 w-auto">
				{chatActions.map((action) => (
					<button
						key={action.id}
						className={`flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-gray-200 w-full ${action.id === "delete" ? "text-red-600 hover:bg-red-200" : ""
							}`}
						onClick={action.onClick}>
						<span className="text-lg">{action.icon}</span>
						<span className={`${nunito.className} text-[14px] font-medium`}>
							{action.label}
						</span>
					</button>
				))}
			</div>

			{/* MODALS */}
			{showBlock && <BlockUser setBlockModal={setBlockModal} />}
			{showUnfriend && <UnfriendUser setUnfriendModal={setUnfriendModal} />}
			{clearMessages && <ClearMessages setClearMessages={setClearMessages} />}
			{deleteChat && <DeleteChat setDeleteChat={setDeleteChat} />}
		</>
	);
};

export default ChatActionMenu;
