import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useUserProfile, useClickedStore } from "@/zustand";
import Image from "next/image";
import { Nunito } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
import { IoCallOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { RxDotsVertical } from "react-icons/rx";
import { AiOutlineMinus } from "react-icons/ai";
import { usePathname } from "next/navigation";
import formatLastSeen from "@/utils/Formatter";
import ChatActionMenu from "./ChatActionMenu";
import VoiceCall from "../components/VoiceCall";

const TopOfChats = () => {
	const [openActionMenu, setActionMenu] = useState(false);
	const [openVoiceCall, setOpenVoiceCall] = useState(false)

	// all id's
	const { activeUser, setActiveUser, activeChat } = useUserProfile();
	// all id's
	const pathname = usePathname();
	const { setOpenMessage } = useClickedStore();

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const profilePicture =
		`${backendBase}${
			activeUser?.profilePicture ?? activeChat?.user?.profilePicture
		}` || "/assets/images/userImage.jpg";

	// function to close or disconnect socket connection

	function endSocket() {
		setActiveUser(false) || setOpenMessage(false);
	}

	return (
		<>
			<div className="w-full bg-white h-[65px] md:h-auto py-1 rounded-b-md md:rounded-none shadow-md z-[99]">
				{pathname !== "/" && (
					<AiOutlineMinus
						className="text-xl hidden md:block ml-auto mr-2"
						onClick={endSocket}
					/>
				)}
				<section className="w-full flex flex-row justify-between items-center px-2">
					{/* first div */}
					<div className="space-x-[10px] flex flex-row items-center justify-center overflow-hidden pt-2 md:pt-0">
						<FaArrowLeft className="text-lg md:hidden" onClick={endSocket} />

						<Image
							className="w-12 h-12 rounded-full object-cover"
							src={profilePicture}
							width={190}
							height={190}
							alt="profilePicture"
						/>

						<div className="flex flex-col">
							<p className={`text-sm font-bold ${nunito.className}`}>
								{activeUser?.username || activeChat?.user?.fullName}
							</p>
							<p className="text-[12px] text-[#7304af]">
								{
									 activeChat?.user?.lastSeen
									? `Last seen ${formatLastSeen(activeChat.user.lastSeen)}`
									: "Last seen a long time ago"}
							</p>
						</div>
					</div>
					{/* first div */}

					{/* second div */}
									{/** */}
					<div className="space-x-3 flex flex-row items-center justify-center overflow-hidden pt-1  cursor-pointer">
						{/* <div className="flex flex-row divide-x divide-gray-300 border-[1.5px] rounded-md border-gray-200 py-2 px-3">
							<div className="pr-3">
								<IoCallOutline
									className="text-xl font-semibold"
									onClick={() => setOpenVoiceCall(true)}
								/>
							</div>
							<div className="pl-3">
								<CiVideoOn className="text-xl" strokeWidth={0.2} />
							</div>
						</div> */}

						<RxDotsVertical
							className="text-xl font-semibold"
							onClick={() => setActionMenu(!openActionMenu)}
						/>
					</div>
					{/* second div */}
				</section>
			</div>
			{openActionMenu && <ChatActionMenu setActionMenu={setActionMenu} />}
			{openVoiceCall && <VoiceCall setOpenVoiceCall={setOpenVoiceCall} />}
		</>
	);
};

export default TopOfChats;

// http://localhost:5001/api/messages/6902025d7cb761fc698ea42b
