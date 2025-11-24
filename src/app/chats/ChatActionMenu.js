import React, { useEffect, useState, useRef } from "react";
import { TbUserCancel } from "react-icons/tb";
import { RiUserUnfollowLine } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi";
import { IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineClear } from "react-icons/ai";
import { Nunito } from "next/font/google";
import DeleteChat from "../components/DeleteChat";
import ClearMessages from "../components/ClearMessages";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

import BlockUser from "@/utils/BlockUser";
import UnfriendUser from "@/utils/UnfriendUser";

const ChatActionMenu = ({ setActionMenu, chatId, userId }) => {
	const [showBlock, setBlockModal] = useState(false);
	const [showUnfriend, setUnfriendModal] = useState(false);
	const [clearMessages, setClearMessages] = useState(false);
	const [deleteChat, setDeleteChat] = useState(false);
	const [favourites, setFavourites] = useState(false);

	const dropdownRef = useRef(null);

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
			id: "Favourites",
			label: "Favourites",
			icon: <IoIosHeartEmpty />,
			onClick: () => setFavourites(true)
		},
	];

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
			<div className="fixed inset-0 bg-transparent z-40"></div>

			<div
				ref={dropdownRef}
				className="fixed right-3 top-14 md:top-12 z-50 bg-gray-100 shadow rounded-md p-2 flex flex-col space-y-2 w-44">
				{chatActions.map((action) => (
					<button
						key={action.id}
						className={`flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-gray-200 w-full ${
							action.id === "delete" ? "text-red-600 hover:bg-red-200" : ""
						}`}
						onClick={action.onClick}>
						<span className="text-lg">{action.icon}</span>
						<span className={`${nunito.className} text-[15px] font-medium`}>
							{action.label}
						</span>
					</button>
				))}
			</div>

			{showBlock && <BlockUser setBlockModal={setBlockModal} />}
			{showUnfriend && <UnfriendUser setUnfriendModal={setUnfriendModal} />}
			{clearMessages && <ClearMessages setClearMessages={setClearMessages} />}
			{deleteChat && <DeleteChat setDeleteChat={setDeleteChat} />}
		</>
	);
};

export default ChatActionMenu;
