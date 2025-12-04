"use client";
import React, { useRef, useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuthenticatedStore, useUserProfile } from "@/zustand";
import { Nunito } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
import { CiEdit } from "react-icons/ci";
import { MdOutlineContentCopy } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

const MessageActions = ({ setOpenMessageMenu }) => {
	const dropdownRef = useRef(null);
	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(true);
	const {
		activeMessage,
		myMessage,
		messageId,
		setIsEditing,
		setActiveMessage,
	} = useUserProfile();
	const { token } = useAuthenticatedStore();
	const queryClient = useQueryClient();

	const FIFTEEN_MINUTES = 15 * 60 * 1000;

	const isEditable =
		myMessage?.createdAt &&
		new Date() - new Date(myMessage?.createdAt) < FIFTEEN_MINUTES;

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(activeMessage);
			setSuccess(true);
			setStatus("Message copied!");
			setTimeout(() => {
				setStatus("");
				setOpenMessageMenu(false);
			}, 2000);
		} catch (err) {
			setSuccess(false);
			setStatus("Copy failed!");
		}
	};

	const handleStar = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_STAR_MESSAGE}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ messageId: messageId }),
			});

			if (!res.ok) throw new Error("Failed");

			if (res.ok) {
				setSuccess(true);
				setStatus("Message starred!");

				setTimeout(() => {
					setStatus("");
					setOpenMessageMenu(false);
				}, 2000);
			}
		} catch (err) {
			setSuccess(false);
			setStatus("Failed to star message!");
		}
	};

	const handleEdit = async () => {
		setIsEditing(true);
		setOpenMessageMenu(false);
	};

	const handleDelete = async () => {
		try {
			const res = await fetch(
				process.env.NEXT_PUBLIC_DELETE_A_MESSAGES.replace(
					"{messageId}",
					messageId
				),
				{
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!res.ok) throw new Error("Failed");

			setSuccess(true);
			setStatus("Message deleted!");
			setTimeout(() => {
				setStatus("");
				setOpenMessageMenu(false);
			}, 2000);

			queryClient.invalidateQueries({ queryKey: ["all_messages"] });
			queryClient.invalidateQueries({ queryKey: ["chat_messages"] });
		} catch (err) {
			setSuccess(false);
			setStatus("Failed to delete!");
		}
	};

	// CLICK OUTSIDE MENU
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpenMessageMenu(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [setOpenMessageMenu]);

	return (
		<>
			{/* STATUS NOTIFICATION */}
			{status && (
				<div
					className={`top-2 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}

			{/* MENU */}
			<div className="fixed inset-0 flex">
				<div
					className={`absolute z-50 right-1/2 top-14 bg-gray-100 shadow rounded-md p-3 flex flex-col space-y-3 w-52`}
					ref={dropdownRef}>
					{/* MESSAGE PREVIEW BOX */}
					<div className="border-4 border-purple-700 rounded-lg bg-gray-50 p-1">
						<p className={`text-[14px] text-gray-800 ${nunito.className}`}>
							{activeMessage}
						</p>
					</div>

					{/* STAR */}
					<div
						className="flex flex-row items-center space-x-4 px-2 py-2 rounded-md hover:bg-gray-200 w-full"
						onClick={handleStar}>
						{activeMessage?.isStarred ? (
							<FaStar className="text-lg" />
						) : (
							<FaRegStar className="text-xl" />
						)}
						<span className={`text-[15px] font-medium ${nunito.className}`}>
							Star
						</span>
					</div>

					{/* COPY */}
					<div
						className="flex flex-row items-center space-x-4 px-2 py-2 rounded-md hover:bg-gray-200 w-full"
						onClick={handleCopy}>
						<MdOutlineContentCopy className="text-lg" />
						<span className={`text-[15px] font-medium ${nunito.className}`}>
							Copy
						</span>
					</div>

					{/* EDIT */}
					{myMessage && isEditable && (
						<div
							className="flex flex-row items-center space-x-4 px-2 py-2 rounded-md hover:bg-gray-200 w-full"
							onClick={handleEdit}>
							<CiEdit className="text-[22px]" />
							<span className={`text-[15px] font-medium ${nunito.className}`}>
								Edit
							</span>
						</div>
					)}

					{/* DELETE */}
					<div
						className="flex flex-row items-center space-x-4 px-2 py-2 rounded-md hover:bg-gray-200 w-full"
						onClick={handleDelete}>
						<MdOutlineDelete className="text-[22px] text-red-600" />
						<span className={`text-[15px] font-medium ${nunito.className}`}>
							Delete
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default MessageActions;
