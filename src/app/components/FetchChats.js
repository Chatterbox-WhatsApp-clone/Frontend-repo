"use client";
import React, { useState, useEffect } from "react";
import { socket } from "@/socket";
import {
	useMessagesStore,
	useAuthenticatedStore,
	useUserProfile,
} from "@/zustand";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { generateChatId } from "@/utils/GenerateChatId";
import { Nunito } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

const FetchChats = () => {
	const { token } = useAuthenticatedStore();
	return <div></div>;
};

export default FetchChats;
