"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Nunito, Poppins } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedStore, useUserProfile } from "@/zustand";
import Spinner from "@/Spinner";
import AddFriendButton from "../AddFriendButton";
import { useRouter } from "next/navigation";
import RemoveFriendButton from "../RemoveFriendButton";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const SearchedUsers = ({ input }) => {
	const router = useRouter();
	const { token } = useAuthenticatedStore();
	const { activeUser, setActiveUser } = useUserProfile();
	const [debounced, setDebounced] = useState("");
	const searchTerm = input;

	// deounced funtion
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounced(searchTerm);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [searchTerm]);
	// debounced funtion

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const endpoint = process.env.NEXT_PUBLIC_SEARCH_USERS;

	const fetchfriends = async () => {
		const res = await fetch(
			`${endpoint}?query=${encodeURIComponent(searchTerm)}`,
			{
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return res.json();
	};

	const { data, isLoading } = useQuery({
		queryKey: ["search-users", debounced],
		queryFn: fetchfriends,
		enabled: !!debounced,
		staleTime: 10000,
		cacheTime: 50000,
	});

	return (
		<div
			className="w-full h-full flex flex-col gap-2 py-2 overflow-y-auto px-1"
			style={{ scrollbarWidth: "none" }}>
			<h1 className={`text-base font-bold px-2 md:px-3 ${nunito.className}`}>Users</h1>

			{/* Loading State */}
			{isLoading ? (
				<div className="flex flex-col justify-center items-center mt-20 gap-3">
					<Spinner />
					<p className={`${poppins.className} text-sm text-gray-600`}>
						Please wait while we fetch your results...
					</p>
				</div>
			) : data?.data?.length === 0 ? (
				<div className="flex items-center justify-center w-full">
					<div className="flex flex-col justify-center items-center mt-32 md:mt-24 gap-2">
						<p
							className={`${poppins.className} text-wrap text-center text-sm font-mono font-semibold`}>
							We couldn’t find any user with that name. Try searching with a
							different name
						</p>
					</div>
				</div>
			) : (
				<>
					<div className="flex-1 w-full h-full flex flex-col gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-2 py-2 px-1 md:px-1">
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
											{user.relationshipStatus === "not sent" ? (
												<div className="flex flex-row gap-1 w-full">
													<AddFriendButton user={user} />
													<RemoveFriendButton suser={user} />
												</div>
											) : (
												<p
													className={`${poppins.className} font-medium text-sm`}>
													You&apos;re already friends
												</p>
											)}
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

											{user.relationshipStatus === "not sent" ? (
												<>
													<AddFriendButton user={user} />
													<RemoveFriendButton suser={user} />
												</>
											) : (
												<p
													className={`${poppins.className} font-medium text-[13px] text-gray-700 mt-1`}>
													You two are already friends
												</p>
											)}
										</div>
									</div>
								</React.Fragment>
							);
						})}{" "}
					</div>
				</>
			)}
		</div>
	);
};

export default SearchedUsers;
