"use client";
import React, { useState, forwardRef, useEffect, useRef } from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
	useAuthenticatedStore,
	useUpdateUserStore,
	useUserData,
} from "@/zustand";
import Spinner from "@/Spinner";
import { createPortal } from "react-dom";
import { MdOutlinePrivacyTip } from "react-icons/md";
import DeleteAccount from "../components/DeleteAccount";
import EmailSection from "./EmailSection";
import AccountSection from "./AccountSection";
import PhoneSection from "./PhoneSection";
import Security from "./Security";
import EditStatus from "./EditStatus";
import BackgroundImage from "./BackgroundImage";
import ImageSettingsSection from "./ImageSettingsSection";
import { GoPencil } from "react-icons/go";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const DesktopSetting = forwardRef(({ setShowDesktopSetting }, ref) => {
	const { token } = useAuthenticatedStore();
	const userEndpoint = process.env.NEXT_PUBLIC_GET_USER_ENDPOINT;
	const [linkCopied, setLinkCopied] = useState(false);
	const { userUpdated, setUserUpdated } = useUpdateUserStore();
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

	const { data, isError, isLoading, refetch } = useQuery({
		queryKey: ["full-user-data"],
		queryFn: fetchUserInfo,
		staleTime: 300000,
		cacheTime: 300000,
	});

	// refetch on userUpdated
	useEffect(() => {
		if (userUpdated) {
			refetch();
			setUserUpdated(false);
		}
	}, [userUpdated, refetch, setUserUpdated]);

	
	// handle outside click for settings modal
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref?.current && !ref.current.contains(e.target)) {
				setShowDesktopSetting(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [ref, setShowDesktopSetting]);

	// profile picture URL
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const profilePicture = data?.data?.profilePicture
		? `${backendBase}${data.data.profilePicture}`
		: "/assets/images/userImage.jpg";

	// handle invite copy
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

	return createPortal(
		<>
			<div ref={ref}>
				<div
					className="hidden md:block fixed bottom-8 left-5 z-[999] w-[500px] bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[80vh] p-5"
					style={{ scrollbarWidth: "none" }}>
					<div className="border-b border-gray-300 pb-3">
						<h1 className={`${nunito.className} font-bold text-2xl`}>
							Settings
						</h1>
					</div>

					{isLoading ? (
						<div>
							<Spinner />
							<p
								className={`text-lg mt-5 font-bold text-center mx-auto relative ${nunito.className}`}>
								Please wait while we fetch your details
							</p>
						</div>
					) : isError ? (
						<div className="flex flex-col h-full w-full justify-center items-center">
							<p
								className={`text-lg font-bold text-center text-red-600 ${nunito.className}`}>
								There was an error fetching your details. Please try again later
							</p>
						</div>
					) : (
						<>
							{/* Profile Section */}
							<BackgroundImage />
							<div
								className="-mt-6 w-full flex items-center justify-start border-b border-gray-300 pb-5"
								key={data?._id}>
								<div className="flex flex-col justify-start items-start space-y-5 w-full ">
									<ImageSettingsSection profilePicture={profilePicture} />
									<div className="w-full flex flex-1 flex-col space-y-1">
										<h1
											className={`${nunito.className} text-lg truncate font-semibold`}>
											Name:{" "}
											<span className="font-normal">
												{data?.data?.username}
											</span>
										</h1>
										<p
											className={`${poppins.className} text-sm truncate font-semibold`}>
											Status:{" "}
											<span className="font-normal">{data?.data?.status}</span>
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
											<span className="font-normal">
												{data?.data?.dateJoined}
											</span>
										</p>
									</div>
								</div>
							</div>

							{/* Account Sections */}
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
							<div className="mt-5 border-b border-gray-300 pb-5 flex items-center gap-5 justify-start">
								<p className={`${poppins.className} text-[15px]`}>
									Invite a friend
								</p>
								<button
									onClick={handleCopyLink}
									className="text-[#3a0657] font-bold cursor-pointer underline z-50">
									{linkCopied ? "Link Copied!" : "Copy Link"}
								</button>
							</div>

							{/* Delete Account */}
							<DeleteAccount />
						</>
					)}
				</div>
			</div>

			{/* EditImage modal rendered at top layer via portal */}
		</>,
		document.body
	);
});

export default DesktopSetting;
