"use client";
import React, { useState, useEffect } from "react";
import { Nunito, Poppins } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useAuthenticatedStore, useRemovedStore } from "@/zustand";
import AddFriendButton from "./AddFriendButton";
import RemoveFriendButton from "./RemoveFriendButton";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const AllFriends = () => {
	const { token } = useAuthenticatedStore();
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const endpoint = process.env.NEXT_PUBLIC_AVAILABLE_FRIENDS;
	const { removed, setRemoved } = useRemovedStore();

	const fetchUsers = async () => {
		const res = await fetch(endpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data, refetch } = useQuery({
		queryKey: ["all-available-friends"],
		queryFn: fetchUsers,
		staleTime: 5000,
		cacheTime: 10000,
	});

	// refetch users
	useEffect(() => {
		if (removed) {
			refetch();
			setRemoved(false);
		}
	}, [removed, refetch, setRemoved]);
	// refetch users

	return (
		<div className="flex-1 w-full h-full flex flex-col gap-2 sm:grid sm:grid-cols-3 mt-3 md:mt-0 lg:grid-cols-4 sm:gap-2 py-2 px-1 md:px-1">
			{data?.data?.map((user) => {
				const profilePicture = user?.profilePicture
					? `${backendBase}${user.profilePicture}`
					: "/assets/images/userImage.jpg";

				return (
					<React.Fragment key={user._id}>
						{/* Small screens */}
						<div className="h-[90px] w-full flex justify-start items-center flex-row space-x-4 sm:hidden">
							<div className="h-[90px] w-[90px] flex-shrink-0">
								<Image
									src={profilePicture}
									width={70}
									height={70}
									alt="User profile picture"
									className="w-full h-full rounded-full object-cover"
								/>
							</div>

							<div className="flex flex-col justify-center items-start w-full gap-1">
								<p className={`${poppins.className} font-medium text-sm`}>
									{user.username}
								</p>
								<div className="flex flex-row gap-1 w-full">
									<AddFriendButton user={user} />
									<RemoveFriendButton user={user} />
								</div>
							</div>
						</div>

						{/* Large screens */}
						<div
							className="h-fit hidden sm:flex flex-col w-40 shadow-2xl rounded-xl pb-1 bg-white"
							key={user._id + "-lg"}>
							<Image
								src={profilePicture}
								width={100}
								height={100}
								alt="User profile picture"
								className="w-full max-h-36 rounded-t-xl object-cover"
							/>
							<div className="px-2 mt-2">
								<p className={`${poppins.className} font-medium text-sm`}>
									{user.username}
								</p>

								<AddFriendButton user={user} />
								<RemoveFriendButton user={user} />
							</div>
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default AllFriends;
