"use client";
import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import { MdOutlineAddIcCall } from "react-icons/md";
import {
	useAuthenticatedStore,
	useUserProfile,
	useClickedStore,
} from "@/zustand";
import { useQuery } from "@tanstack/react-query";
import { Poppins, Nunito } from "next/font/google";
import {LiaTimesSolid} from "react-icons/lia";
import Image from 'next/image'

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "800", "900"],
});

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const CallList = () => {
	const [search, setSearch] = useState("");

	// for calls
	const endpoint = process.env.NEXT_PUBLIC_GET_CALLS;
	const { token } = useAuthenticatedStore();
	const loadChats = async () => {
		try {
			const res = await fetch(endpoint, {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			});
			return res.json()
		} catch (error) {
			console.log(error);
		}
	};

	const { data, isLoading } = useQuery({
		queryKey: ["calls"],
		queryFn: loadChats,
		staleTime: 300000,
		cacheTime: 500000,
	});

	return (
		<div className="w-full md:w-[280px] h-screen flex flex-col pt-3 gap-2 ">
			<header className="flex items-center justify-between">
				<h1 className={`text-2xl font-bold ${nunito.className}`}>Calls</h1>
				<MdOutlineAddIcCall className="text-2xl mr-1" />
			</header>

			<form className="w-[95%] flex justify-center items-center row relative gap-2">
				<input
					type="text"
					placeholder="Search or start a new chat"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={`input py-1 rounded-full border text-sm px-4 text-center w-full border-b-3 border-b-[#8f45b7] focus:outline-none`}
					onClick={(e) => setTouched(true)}
				/>
				<GoSearch className="text-black text-[13px] absolute left-0 top-0 translate-y-1/2 ml-2 mt-[2px] z-50 md:hidden" />
				{search.length > 0 && (
					<LiaTimesSolid
						className="text-black text-[13px] absolute right-0 mr-2 top-0 translate-y-1/2 mt-[2px] cursor-pointer z-50"
						onClick={(e) => setSearch("")}
					/>
				)}
			</form>

			<div className="flex-1 flex flex-col mt-3 px-1 h-full w-full">
				<h3
					className={`text-lg font-semibold text-gray-900 w-full shadow-2xl ${poppins.className}`}>
					Recent
				</h3>

				{isLoading ? (
					<div className="flex flex-col justify-center items-center h-full">
						<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
						<p className={`text-base mt-2 font-medium ${nunito.className}`}>
							Loading calls...
						</p>
					</div>
				) : isError ? (
					<div className="flex flex-col justify-center items-center h-full">
						<p className="text-red-500 text-lg font-semibold">
							Failed to load calls.
						</p>
					</div>
				) : data?.data?.length < 1 ? (
					<div className="flex flex-col justify-center items-center h-full">
						<p className={`text-base font-medium ${nunito.className}`}>
							You do not have any recent calls yet.
						</p>
					</div>
				) : (
					<div className="h-full w-full overflow-y-auto noscroll flex flex-col space-y-4 py-3">
						{data?.data?.map((call) => (
							<div
								key={call._id}
								className="w-full flex flex-row items-center p-3 bg-gray-100 rounded-md shadow">
								{/* User Picture */}
								<Image
									src={call.user?.profilePic}
									alt="profile"
									className="w-12 h-12 rounded-full object-cover"
								/>

								<div className="flex flex-col ml-3 flex-1">
									{/* Username */}
									<span
										className={`text-sm font-semibold text-gray-900 ${poppins.className}`}>
										{call.user?.username}
									</span>

									{/* Incoming / outgoing + type */}
									<span className="text-xs text-gray-500">
										{call.direction === "incoming" ? "Incoming" : "Outgoing"} •{" "}
										{call.type === "video" ? "Video Call" : "Audio Call"}
									</span>
								</div>

								{/* Date */}
								<span className="text-xs text-gray-400">
									{new Date(call.createdAt).toLocaleDateString()}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CallList;
