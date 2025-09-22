"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
// import { useState, useEffect } from "react";
import { useAuthenticatedStore } from "@/zustand";
import { IoIosArrowForward } from "react-icons/io";
const AllChats = () => {
	const { token } = useAuthenticatedStore();
	const router = useRouter()
	// fetch online users
	const onlineEndpoint = process.env.NEXT_PUBLIC_GET_USER_CHATS_ENDPOINT;
	const fetchUsers = async () => {
		const res = await fetch(onlineEndpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data } = useQuery({
		queryKey: ["users-chat"],
		queryFn: fetchUsers,
		staleTime: 100000,
		cacheTime: 300000,
	});

	return (
		<div className="h-full relative flex justify-center items-center overflow-y-auto w-full">
			{data?.data?.length === 0 ? (
				<div className="flex flex-col justify-center items-center gap-3 relative mt-32">
					<p
						className={`${poppins.className}  text-wrap text-center text-sm font-mono`}>
						You don’t have any friends yet. Go to the Friends page and connect
						to make some friends!
					</p>
					<button onClick={((e) => router.push('/friends'))} className="rainbow-hover bg-[#7e5497] h-10 px-5 flex flex-row items-center justify-center rounded-2xl text-white cursor-pointer">
						<span className={`text-sm text-center ${poppins.className}`}>
							Go to Friends Page
						</span>
						<IoIosArrowForward className="text-lg" />
					</button>
				</div>
			) : (
				<div className="flex flex-col h-full justify-center items-center">
					{data?.data?.map((chat) => (
						<p>Hello</p>
					))}
				</div>
			)}
		</div>
	);
};

export default AllChats;
