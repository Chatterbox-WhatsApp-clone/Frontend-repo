"use client";
import React from "react";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useAuthenticatedStore, useRequestedId } from "@/zustand";
const FriendsRequest = () => {
	const { token } = useAuthenticatedStore();
	return (
		<div className="flex-1 w-full h-full flex flex-col gap-2  sm:grid sm:grid-cols-3 mt-3 md:mt-0 lg:grid-cols-4 sm:gap-2 py-2 px-1 md:px-3">
			{data?.data?.map((user) => {
				const profilePicture = user?.profilePicture
					? `${backendBase}${user.profilePicture}`
					: "/assets/images/userImage.jpg";

				return (
					<div key={user._id}>
						{/* small screens */}
						<div
							className="h-[90px] w-full flex justify-start items-center flex-row space-x-4 sm:hidden"
							>
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
									<AddFriendButton removed={removed} />
									<RemoveFriendButton
										setRemoved={setRemoved}
										removed={removed}
									/>
								</div>
							</div>
						</div>

						{/* large screens */}
						<div
							className="h-62 hidden sm:flex flex-col w-40 shadow-2xl rounded-xl bg-white"
							onClick={() => setUserRequestedId(user._id)}>
							<Image
								src={profilePicture}
								width={100}
								height={100}
								alt="User profile picture"
								className="w-full h-[60%] rounded-t-xl object-cover"
							/>
							<div className="px-2 mt-2">
								<p className={`${poppins.className} font-medium text-sm`}>
									{user.username}
								</p>
								<AddFriendButton removed={removed} />
								<RemoveFriendButton setRemoved={setRemoved} removed={removed} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default FriendsRequest;
