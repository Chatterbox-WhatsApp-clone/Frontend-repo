"use client";
import React, { useEffect } from "react";
import { useClickedStore, useUserProfile } from "@/zustand";
import Image from "next/image";
import { Nunito } from "next/font/google";
import FullWidthUserProfile from "./FullWidthUserProfile";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
import TopOfChats from "./TopOfChats";
import ChatsBottom from "./ChatsBottom";
const Messages = () => {
	const { openMessage } = useClickedStore();
	// const { activeUser } = useUserProfile();

	return (
		<div
			className={`fixed inset-0 translate-x-0 messages bg-gray-200 transition-transform duration-500 ease-in-out flex flex-col w-full md:ml-1 h-full ${
				openMessage ? "block" : "hidden"
			} md:relative md:flex flex-1 flex-col md:bg-transparent`}>
			{openMessage ? (
				<div
					className="w-full h-full z-50 messages top-0 fixed inset-0 translate-x-0 transition-transform ease-in-out"
					style={{
						backgroundImage: `url(/assets/images/chatBackground.jpg)`,
						backgroundSize: "contain",
						backgroundRepeat: "repeat",
						backgroundPosition: "top left",
					}}>
					<TopOfChats />
					<FullWidthUserProfile />
					<ChatsBottom />
				</div>
			) : (
				<div className="flex flex-col gap-1 justify-center items-center h-full">
					<Image
						src={"/assets/images/chatterbox-logo.png"}
						width={50}
						height={50}
						alt="logo"
					/>
					<h1 className="text-xl text-gray-800 font-semibold">
						Welcome to chatterbox
					</h1>
					<p className={`${nunito.className} text-sm text-gray-500`}>
						Send and receive messages and share memorable moments with your
						friends
					</p>
				</div>
			)}
		</div>
	);
};

export default Messages;

{
	/**{"success":true,"data":[{"chatId":"6902025d7cb761fc698ea42b","user":{"_id":"68de686222485ad8bf8b1a9b","username":"Chibueze Obodo","profilePicture":"/uploads/profilePics/1759440259776-399507133.jpg","isOnline":false,"lastSeen":"2025-10-30T21:53:30.069Z","totalContacts":0,"totalBlocked":0,"fullName":"Chibueze Obodo","id":"68de686222485ad8bf8b1a9b"},"lastMessage":{"_id":"6903e765be57427fd5477fa4","content":{"media":{},"location":{},"contact":{},"text":"Bro? Why you no dey reply me?"},"type":"text","sender":{"_id":"68c1b5fc7773252c43b20472","username":"Chibueze","profilePicture":"/uploads/profilePics/1757525564319-542298099.jpg","totalContacts":0,"totalBlocked":0,"fullName":"Chibueze","id":"68c1b5fc7773252c43b20472"},"createdAt":"2025-10-30T22:32:05.717Z"},"lastMessageTime":"2025-10-30T22:32:05.717Z","unreadCount":0,"isActive":true,"createdAt":"2025-10-29T12:02:37.681Z","updatedAt":"2025-10-30T22:32:06.039Z"}],"pagination":{"currentPage":1,"totalPages":1,"totalChats":1,"hasNextPage":false,"hasPrevPage":false}} */
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGMxYjVmYzc3NzMyNTJjNDNiMjA0NzIiLCJpYXQiOjE3NjI0MzA1MzR9.W8j1nGs_TyIuGTFqbI1gLS84a888-kG_YUPsk34W6zI";
}

// {}