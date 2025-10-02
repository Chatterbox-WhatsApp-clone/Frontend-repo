"use client";
import React, { useState, useEffect } from "react";
import { Nunito, Poppins } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useAuthenticatedStore } from "@/zustand";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import FriendOptions from "./FriendOptions";

const MyFriends = () => {
	const { token } = useAuthenticatedStore();
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const endpoint = process.env.NEXT_PUBLIC_ACCEPTED_FIRENDS;
	const router = useRouter();

	const fetchfriends = async () => {
		const res = await fetch(endpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data } = useQuery({
		queryKey: ["all-friends"],
		queryFn: fetchfriends,
		staleTime: 10000,
		cacheTime: 50000,
	});

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(!isOpen);
	const closeModal = () => setIsOpen(false);

	return (
		<>
			<div
				className="w-full h-full overflow-y-auto flex flex-col gap-2 py-2"
				style={{ scrollbarWidth: "none" }}>
				{data?.friends.length === 0 ? (
					<div className="flex items-center justify-center mt-36 w-full">
						<div className="flex flex-col justify-center items-center gap-3">
							<p
								className={`${poppins.className} text-wrap text-center text-sm font-mono`}>
								You don't have any friend (s)
							</p>
							<button
								onClick={() => router.push("/friends")}
								className="rainbow-hover bg-[#7e5497] h-10 px-5 flex flex-row items-center justify-center rounded-2xl text-white cursor-pointer">
								<span className={`text-sm text-center ${poppins.className}`}>
									Go to Friends Page
								</span>
								<IoIosArrowForward className="text-lg" />
							</button>
						</div>
					</div>
				) : (
					<>
						<p className={`${nunito.className} text-base font-bold mt-1 mb-1`}>
							{data?.friends?.length}
							<span> {data?.friends?.length > 1 ? "Friends" : "Friend"} </span>
						</p>

						{data?.friends?.map((friend) => {
							const profilePicture = friend?.profilePicture
								? `${backendBase}${friend.profilePicture}`
								: "/assets/images/friendImage.jpg";

							return (
								<div
									className="h-[60px] w-full flex justify-between items-center flex-row"
									key={friend._id}>
									<div className="flex justify-center items-center flex-row space-x-4">
										<div className="h-[60px] w-[60px] flex-shrink-0">
											<Image
												src={profilePicture}
												width={70}
												height={70}
												alt="friend profile picture"
												className="w-full h-full rounded-full object-cover"
											/>
										</div>

										<div className="flex flex-col justify-center items-start w-full gap-1">
											<p className={`${poppins.className} font-medium text-sm`}>
												{friend.fullName}
											</p>
										</div>
									</div>

									<div className="relative inline-block">
										<BiDotsHorizontalRounded
											className=" text-gray-800 text-2xl relative inline-block cursor-pointer"
											onClick={openModal}
										/>

										{isOpen && <FriendOptions friend={friend} />}
									</div>
								</div>
							);
						})}
					</>
				)}
			</div>
		</>
	);
};

export default MyFriends;
