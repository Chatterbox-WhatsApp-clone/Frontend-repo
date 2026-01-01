"use client";
import React, { useState, useEffect } from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
	useAuthenticatedStore,
	useUpdateUserStore,
	useUserData,
} from "@/zustand";
import Spinner from "@/Spinner";
import { GoPencil } from "react-icons/go";
import { MdOutlinePrivacyTip } from "react-icons/md";
import Security from "./Security";
import EditStatus from "./EditStatus";
import AccountSection from "./AccountSection";
import EmailSection from "./EmailSection";
import PhoneSection from "./PhoneSection";
import BackgroundImage from "./BackgroundImage";
import ImageSettingsSection from "./ImageSettingsSection";
import DeleteAccount from "../components/DeleteAccount";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Page = () => {
	const { token } = useAuthenticatedStore();
	const { userUpdated, setUserUpdated } = useUpdateUserStore();
	const userEndpoint = process.env.NEXT_PUBLIC_GET_USER_ENDPOINT;
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

	// show image.

	const [linkCopied, setLinkCopied] = useState(false);

	const [editStatus, setOpenEditStatus] = useState(false);

	// fetch user info
	const fetchUserInfo = async () => {
		try {
			const res = await fetch(userEndpoint, {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			});
			return res.json();
		} catch (error) {
			console.log(error, "Error fetching user data");
		}
	};

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["full-user-data"],
		queryFn: fetchUserInfo,
		staleTime: 300000,
		cacheTime: 300000,
	});
	// fetch user info

	// reftech once userIsUpdated
	useEffect(() => {
		if (userUpdated) {
			refetch();
			setUserUpdated(false);
		}
	}, [userUpdated, refetch, setUserUpdated]);
	// reftech once userIsUpdated

	// url for image
	const profilePicture = data?.data?.profilePicture
		? `${data.data.profilePicture}`
		: "/assets/images/userImage.jpg";

	// url for image

	// function to copy link
	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(
				"https://frontend-repo-rho.vercel.app/"
			);
			setLinkCopied(true);
			setTimeout(() => setLinkCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};
	// function to copy link

	if (isLoading)
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Spinner />
				<p className={`${nunito.className} mt-5 font-bold text-center`}>
					Please wait while we fetch your details
				</p>
			</div>
		);

	if (isError)
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<p className={`${nunito.className} text-red-600 font-bold text-center`}>
					There was an error fetching your details. Please try again later
				</p>
			</div>
		);

	return (
		<>
			<div className="block md:hidden w-full h-full bg-gray-50 pb-20 overflow-y-auto">
				{/* Profile Section */}
				<BackgroundImage />
				<div className="px-2">
					<div className="-mt-6 flex flex-col justify-start items-start space-y-5 border-b border-gray-300 pb-5">
						<ImageSettingsSection profilePicture={profilePicture} />
						<div className="flex flex-col space-y-1 w-full">
							<h1
								className={`${nunito.className} text-lg font-semibold truncate`}>
								Name:{" "}
								<span className="font-normal">{data?.data?.username}</span>
							</h1>
							<p
								className={`${poppins.className} text-sm truncate font-semibold`}>
								Status:{" "}
								<span className="font-normal">{data?.data?.status}</span>{" "}
								<GoPencil
									className="inline-flex ml-2 text-[13px] -mt-1 text-[#3a0657]"
									onClick={() => setOpenEditStatus(!editStatus)}
								/>
							</p>
							{editStatus && (
								<EditStatus setOpenEditStatus={setOpenEditStatus} />
							)}
							<p
								className={`${poppins.className} text-sm truncate font-semibold`}>
								Date Joined:{" "}
								<span className="font-normal">{data?.data?.dateJoined}</span>
							</p>
						</div>
					</div>

					{/* Account, Email, Phone Sections */}
					<AccountSection data={data} />
					<EmailSection data={data} />
					<PhoneSection data={data} />

					{/* Privacy Section */}
					<div className="mt-5 border-b border-gray-300 pb-5">
						<h1
							className={`${nunito.className} text-base font-semibold flex flex-row gap-3 items-center`}>
							<MdOutlinePrivacyTip className="text-xl" /> Privacy
						</h1>
						<p className={`${poppins.className} mt-2 text-[15px]`}>
							Blocked Friends: {data?.data?.totalBlocked}
						</p>
					</div>

					<Security />

					{/* Invite Friend */}
					<div className="mt-5 border-b border-gray-300 pb-5 flex items-center justify-between">
						<p className={`${poppins.className} text-[15px]`}>
							Invite a friend
						</p>
						<button
							onClick={handleCopyLink}
							className="text-[#3a0657] font-bold cursor-pointer underline">
							{linkCopied ? "Link Copied!" : "Copy Link"}
						</button>
					</div>

					{/* Delete Account */}
					<DeleteAccount />
				</div>
			</div>
		</>
	);
};

export default Page;
