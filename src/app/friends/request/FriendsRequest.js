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
import { useAuthenticatedStore } from "@/zustand";
import AcceptFriendButton from "./AcceptFriendButton";
import RejectFriendButton from "./RejectFriendButton";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

const FriendsRequest = () => {
	const router = useRouter();
	const { token } = useAuthenticatedStore();
	const onlineEndpoint = process.env.NEXT_PUBLIC_GET_FRIEND_REQUEST;
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const fetchUsers = async () => {
		const res = await fetch(onlineEndpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data } = useQuery({
		queryKey: ["all-pending"],
		queryFn: fetchUsers,
		staleTime: 300000,
		cacheTime: 300000,
	});
	return (
		<div className="flex-1 w-full h-full  flex flex-col items-center justify-center overflow-y-auto noscroll">
			{data?.requests?.length === 0 ? (
				<div className="flex items-center justify-center sm:mt-0 w-full">
					<div className="flex flex-col justify-center items-center gap-3">
						<p
							className={`${poppins.className} text-wrap text-center text-sm font-mono`}>
							You don&apos;t have any incoming friend requests
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
				<div className="flex-1 w-full h-full flex flex-col gap-2 sm:grid sm:grid-cols-3 mt-1 md:mt-0 lg:grid-cols-4 sm:gap-2 py-1 sm:py-2 px-1 md:px-3">
					{data?.requests?.map((request) => {
						const user = request.sender;
						const profilePicture = user?.profilePicture
							? `${backendBase}${user.profilePicture}`
							: "/assets/images/userImage.jpg";

						return (
							<React.Fragment key={request._id}>
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
											<AcceptFriendButton request={request} />
											<RejectFriendButton request={request} />
										</div>
									</div>
								</div>

								<div
									key={request._id + "-lg"}
									className="h-fit pb-1 hidden sm:flex flex-col w-40 shadow-2xl rounded-xl bg-white">
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

										<AcceptFriendButton request={request} />
										<RejectFriendButton request={request} />
									</div>
								</div>
							</React.Fragment>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default FriendsRequest;
