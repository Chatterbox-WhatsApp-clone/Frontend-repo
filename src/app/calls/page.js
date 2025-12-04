"use client";

import React, { useMemo, useState } from "react";
import { Nunito, Poppins } from "next/font/google";

import { CiVideoOn } from "react-icons/ci";
import { LuLink2 } from "react-icons/lu";
import PageWrapper from "../chats/PageWrapper";
import CallList from "./CallList";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "800", "900"],
});

const NewCallLinkIcon = () => (
	<span className="relative flex flex-col items-center justify-center">
		<CiVideoOn className="text-2xl text-[#8f45b7]" />
		<LuLink2 className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full " />
	</span>
);

const CallActionButton = ({ label, icon, onClick }) => (
	<button
		// onClick={onClick}
		className="border border-gray-300 rounded-md py-4 px-5 flex flex-col items-center justify-center gap-4 text-gray-800 hover:bg-gray-100 transition-colors">
		<span className="flex items-center justify-center text-3xl text-[#8f45b7]">
			{icon}
		</span>
		<span className={`text-[13px] font-semibold ${nunito.className}`}>{label}</span>
	</button>
);

const Page = () => {	
	const callShortcuts = useMemo(
		() => [
			{
				id: "start-call",
				label: "Start call",
				icon: <CiVideoOn className="text-2xl" />,
			},
			{
				id: "new-call-link",
				label: "New call link",
				icon: <NewCallLinkIcon />,
			},
			{
				id: "call-number",
				label: "Call a number",
				icon: <CiVideoOn className="text-2xl" />,
				// onClick: () => setShowDialingPad(true),
			},
		],
		[]
	);

	return (
		<div className="w-full h-full flex flex-col md:flex-row bg-gray-50 px-2 overflow-hidden">
			<PageWrapper>
				<CallList />
			</PageWrapper>

			<div className="hidden md:flex justify-center items-center px-6 flex-1 w-full">
				
					<div className="flex flex-row gap-3 md:gap-7">
						{callShortcuts.map((action) => (
							<div key={action.id} className="flex flex-col">
								<CallActionButton
									label={action.label}
									icon={action.icon}
									// onClick={action.onClick}
								/>
							</div>
						))}
					</div>
				
			</div>
		</div>
	);
};

export default Page;
