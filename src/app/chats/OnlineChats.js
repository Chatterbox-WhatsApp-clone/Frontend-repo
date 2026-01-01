import React, { useState } from "react";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});
import Image from "next/image";
import { useAuthenticatedStore } from "@/zustand";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const OnlineChats = () => {
	const { token } = useAuthenticatedStore();
	const router = useRouter();

	// fetch online users
	const onlineEndpoint = process.env.NEXT_PUBLIC_GET_ONLINE_USERS_ENDPOINT;
	const fetchUsers = async () => {
		const res = await fetch(onlineEndpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data: onlineUsers } = useQuery({
		queryKey: ["online-users"],
		queryFn: fetchUsers,
		staleTime: 300000,
		cacheTime: 300000,
	});

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

	return (
		<div className={`mt-1 py-1 ${"w-full h-auto overflow-hidden pt-1"}`}>
			<div className="flex flex-row justify-between items-center ">
				<h1 className={`${nunito.className} text-base truncate`}>Online</h1>

				<p
					onClick={(e) => router.push("/friends/online")}
					className={`${poppins.className} text-[13px] underline text-[#7a0bb5] cursor-pointer`}>
					View all
				</p>
			</div>

			<div className="w-full overflow-x-auto space-y-2 mt-1">
				<div className="flex flex-row place-items-center w-full">
					{onlineUsers?.data?.map((onlineUser) => {
						const profilePicture = onlineUser?.profilePicture
							? `${onlineUser.profilePicture}`
							: "/assets/images/userImage.jpg";

						return (
							<div className="relative" key={onlineUser._id}>
								<div className="flex flex-col items-center justify-start space-y-1 rounded-md hover:bg-gray-100 py-1">
									<div className="w-[50px] h-[50px] rounded-full border-2 border-[#7a0bb5] overflow-hidden">
										<Image
											className="w-full h-full object-cover"
											src={profilePicture}
											width={100}
											height={100}
											alt="user profile image"
										/>
									</div>
									<p
										className={`text-black text-[13px] font-medium ${poppins.className}`}>
										{onlineUser.username}
									</p>
								</div>
								<div className="absolute h-2 w-2 right-2 rounded-full bottom-8 bg-green-500"></div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default OnlineChats;
