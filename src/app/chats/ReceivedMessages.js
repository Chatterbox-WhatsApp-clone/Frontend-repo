"use client";
import React from "react";
import { useMessagesStore } from "@/zustand";
import { Nunito } from "next/font/google";
const nunito = Nunito({
    subsets: ["latin"],
    weight: ["400", "500", "700", "1000", "900"],
});

const ReceivedMessages = () => {
	const { recievedMessages } = useMessagesStore();
	return (
		<div>
			{recievedMessages?.map((msg) => {
				return (
					<div
						className={`flex justify-start mt-1`}
						key={msg._id}>
						<div
							className={`py-[3px] flex space-y-1 px-2 rounded-lg break-words w-auto md:max-w-[60%] shadow-3xl
								bg-white text-black
							`}>
							<p className={`text-sm text-start ${nunito.className}`}>
								{msg.content.text}
							</p>

							<div className="flex justify-end items-end mt-[1px] text-[9px] shrink-0 ml-4">
								<p className="text-gray-600 font-semibold">
									{new Date(msg.createdAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
export default ReceivedMessages;
