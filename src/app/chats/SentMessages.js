"use client";
import React from "react";
import { useMessagesStore } from "@/zustand";
import { Nunito } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

const SentMessages = () => {
	const { messages, messageStatus } = useMessagesStore();
	return (
		<div>
			{messages?.map((msg) => {
				return (
					<div className={`flex justify-end mt-[2px]`} key={`sent-${msg.sender._id}`}>
						<div
							className={`py-[3px] flex space-y-1 px-2 rounded-lg break-words w-auto md:max-w-[60%] shadow-2xl
								bg-[#7304af] text-white `}>
							<p className={`text-sm text-start ${nunito.className}`}>
								{msg.content?.text}
							</p>

							<div className="flex justify-end items-end space-x-1 mt-[1px] text-[9px] ml-4">
								<p className="text-gray-300 font-semibold">
									{new Date(msg.createdAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
								{messageStatus === "sent" && <p className="text-gray-300">✓</p>}
								{messageStatus === "delivered" && (
									<p className="text-gray-300">✓✓</p>
								)}
								{messageStatus === "read" && (
									<p className="text-white">✓✓</p>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SentMessages;
