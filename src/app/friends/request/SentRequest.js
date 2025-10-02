"use client";
import React from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useAuthenticatedStore, useRemovedStore } from "@/zustand";
const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
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
import CancelFriend from "./CancelFriend";
// import { IoIosArrowForward } from "react-icons/io";
const SentRequest = ({ modalOnClose }) => {
	const { token } = useAuthenticatedStore();
	const onlineEndpoint = process.env.NEXT_PUBLIC_SENT_FRIEND_REQUEST;
	// const router = useRouter();

	const fetchUsers = async () => {
		const res = await fetch(onlineEndpoint, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.json();
	};

	const { data } = useQuery({
		queryKey: ["sent"],
		queryFn: fetchUsers,
		staleTime: 1000,
		cacheTime: 5000,
	});

	return (
		// overlay
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
			onClick={modalOnClose}>
			<div
				className="w-full sm:w-[43%] h-[60%] overflow-y-auto scroll- bg-white rounded-t-2xl sm:rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out sm:mx-auto z-[99]"
				onClick={(e) => e.stopPropagation()}
				style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}>
				{/* Close button */}
				<div className="px-2 py-2 ">
					<div className="block bg-gray-300 h-5 w-5 rounded-full flex justify-center items-center ml-auto">
						<FaTimes className="text-sm " onClick={modalOnClose} />
					</div>

					{/* Modal content */}
					<div className="h-full overflow-y-auto px-3">
						{data?.requests?.length === 0 ? (
							<div className="flex items-center justify-center h-full mt-36">
								<div className="flex flex-col justify-center items-center ">
									<p
										className={`${poppins.className} text-wrap text-center text-sm font-mono`}>
										You haven't sent any friends yet. Go to the Friends page and
										connect to make some friends!
									</p>
								</div>
							</div>
						) : (
							<div className="w-full h-full flex flex-col gap-3 mt-3">
								<p
									className={`${nunito.className} font-bold text-base text-center`}>
									Outgoing Friend Requests
								</p>
								{data?.requests?.map((request) => {
									const user = request.receiver;
									const profilePicture = request?.receiver?.profilePicture
										? `${backendBase}${user.profilePicture}`
										: "/assets/images/userImage.jpg";

									return (
										<div
											key={request.receiver._id}
											className="h-[70px] w-full flex justify-center items-center flex-row space-x-4">
											<div className="flex flex-row justify-center items-center w-full gap-4">
												<div className="h-[70px] w-[70px] flex-shrink-0">
													<Image
														src={profilePicture}
														width={70}
														height={70}
														alt="User profile picture"
														className="w-full h-full rounded-full object-cover"
													/>
												</div>
												<p
													className={`${poppins.className} font-medium text-sm w-full`}>
													{request.receiver.username}
												</p>
											</div>

											<div className="flex justify-center items-start w-full">
												<CancelFriend request={request} />
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SentRequest;
