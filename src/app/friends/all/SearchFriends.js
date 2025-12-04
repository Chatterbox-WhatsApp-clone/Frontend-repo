"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Nunito, Poppins } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedStore, useUserProfile } from "@/zustand";
import Spinner from "@/Spinner";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const SearchFriends = ({ input }) => {
	const router = useRouter();
	const { token } = useAuthenticatedStore();
	const { activeUser, setActiveUser } = useUserProfile();
	const [debounced, setDebounced] = useState("");
    const searchTerm = input;

	// defounced funtion
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounced(searchTerm);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [searchTerm]);
	// defounced funtion

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const endpoint = process.env.NEXT_PUBLIC_SEARCH_FRIENDS;

	const fetchfriends = async () => {
		const res = await fetch(
			`${endpoint}?name=${encodeURIComponent(searchTerm)}`,
			{
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		return res.json();
	};

	const { data, isLoading } = useQuery({
		queryKey: ["search-friends", debounced],
		queryFn: fetchfriends,
		enabled: !!debounced,
		staleTime: 10000,
		cacheTime: 50000,
	});

	return (
		<div
			className="w-full h-full flex flex-col gap-2 py-2 overflow-y-auto px-1"
			style={{ scrollbarWidth: "none" }}>
			<h1 className={`text-base font-bold ${nunito.className}`}>Friends</h1>

			{/* Loading State */}
			{isLoading ? (
				<div className="flex flex-col justify-center items-center mt-36 md:mt-20 gap-3">
					<Spinner />
					<p className={`${poppins.className} text-sm text-gray-600`}>
						Fetching your results...
					</p>
				</div>
			) : data?.friends?.length === 0 ? (
				<div className="flex items-center justify-center w-full">
					<div className="flex flex-col justify-center items-center mt-32 md:mt-20 gap-2">
						<p
							className={`${poppins.className} text-wrap text-center text-sm font-mono font-semibold`}>
							We couldn’t find any friends with that name. Try searching with a
							different name
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
					{data?.friends?.map((friend) => {
						const profilePicture = friend?.profilePicture
							? `${backendBase}${friend.profilePicture}`
							: "/assets/images/friendImage.jpg";

						return (
							<div
								className={`h-[70px] w-full py-1 ${
									activeUser?._id === friend._id
										? "bg-gray-200"
										: "bg-transparent"
								} hover:bg-gray-200 px-1 cursor-pointer`}
								key={friend._id}>
								<div
									className="h-[60px] w-full flex justify-between items-center flex-row  cursor-pointer"
									onClick={() => setActiveUser(friend)}>
									<div className="flex justify-center items-center flex-row space-x-4 md:space-x-2 lg:space-x-4">
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
												{friend.username}
											</p>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
};

export default SearchFriends;
