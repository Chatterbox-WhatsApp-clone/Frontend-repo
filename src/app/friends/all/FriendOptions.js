"use client";
import React, { useRef, useEffect, useState } from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
import { LuMessageCircleMore } from "react-icons/lu";
import { TbUserCancel } from "react-icons/tb";
import { RiUserUnfollowLine } from "react-icons/ri";
import { useUserProfile } from "@/zustand";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});
const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const FriendOptions = ({ closeModal }) => {
	const { activeUser } = useUserProfile();
	const options = [
		{
			id: 2,
			function: "Block",
			icon: TbUserCancel,
			text: `${activeUser?.username} won't be able to see you on chatterbox`,
		},
		{
			id: 3,
			function: `Unfriend ${activeUser?.username}`,
			icon: RiUserUnfollowLine,
			text: `Remove ${activeUser?.username} as friend`,
		},
	];

	const dropdownRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				closeModal();
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [closeModal]);

	return (
		<div
			ref={dropdownRef}
			className="dropdown absolute top-10 right-2 h-48 w-[230px] bg-gray-300 rounded-md shadow-lg px-2 z-50  bottom-2 "
			onClick={(e) => e.stopPropagation()}>
			
			<div className="absolute -top-1 right-[6px] w-3 h-5 bg-gray-300 rotate-45"></div>

			<div className="flex flex-col items-start justify-start gap-2 mt-3">
				{options.map((option, index) => (
					<div
						className="flex flex-row items-center justify-center gap-2 hover:bg-white cursor-pointer"
						key={option.id}>
						<div className="bg-gray-200 h-8 w-8 rounded-full flex justify-center items-center flex-shrink-0">
							<option.icon
								className={`text-[17px] font-bold ${
									index === options.length - 1 ? "text-red-700" : "text-black"
								}`}
							/>
						</div>

						<div className="flex flex-col">
							<p
								className={`${poppins.className} text-[14px] ${
									index === options.length - 1 ? "text-red-700" : "text-black"
								}`}>
								{option.function}
							</p>
							{option.text && (
								<p
									className={`${poppins.className} text-[12px] text-gray-800 break-words max-w-[220px]`}>
									{option.text}
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FriendOptions;
