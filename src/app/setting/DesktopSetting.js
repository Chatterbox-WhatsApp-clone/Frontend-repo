"use client";
import React, { useState, forwardRef, useEffect } from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedStore, useUpdateUserStore } from "@/zustand";
import Spinner from "@/Spinner";
import { IoKeyOutline } from "react-icons/io5";
import { createPortal } from "react-dom";
import {
	MdOutlineEmail,
	MdOutlineDeleteOutline,
	MdOutlinePrivacyTip,
} from "react-icons/md";
import { IoIosPhonePortrait } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import EditEmail from "../components/EditEmail";
import EditImage from "../components/EditImage";
import EditPhone from "../components/EditPhone";
import DeleteAccount from "./DeleteAccount";
import Security from "./Security";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
const DesktopSetting = forwardRef(({ setShowDesktopSetting }, ref) => {
	const { token } = useAuthenticatedStore();
	const userEndpoint = process.env.NEXT_PUBLIC_GET_USER_ENDPOINT;
	const [linkCopied, setLinkCopied] = useState(false);
	const [openEditImage, setOpenEditImage] = useState(false);
	const [openEditPhone, setOpenEditPhone] = useState(false);
	const [openEditEmail, setOpenEditEmail] = useState(false);
	const { userUpdated, setUserUpdated } = useUpdateUserStore();

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

	useEffect(() => {
		if (userUpdated) {
			refetch();
			setUserUpdated(false);
		}
	}, [userUpdated]);

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const profilePicture = data?.data?.profilePicture
		? `${backendBase}${data.data.profilePicture}`
		: "/assets/images/userImage.jpg";

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText("https://yourapp.com/invite");
			setLinkCopied(true);
			setTimeout(() => setLinkCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	useEffect(() => {
		function handleClickOutside(e) {
			if (ref && ref.current && !ref.current.contains(e.target)) {
				setShowDesktopSetting(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [ref, setShowDesktopSetting]);

	return createPortal(
		<>
			<div ref={ref}>
				<div
					className="fixed bottom-8 left-5 z-[999] w-[500px] bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[80vh] p-5"
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
							<div className="mt-4 w-full flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<div className="w-20 h-20 relative group">
										{/* User Image */}
										<Image
											src={profilePicture}
											alt="User image"
											fill
											className="object-cover rounded-full"
											sizes="80px"
										/>

										{/* Overlay + Icon (shows on hover) */}
										<div
											className="
											absolute inset-0 
											bg-black/60 
											rounded-full 
											flex items-center justify-center
											opacity-0 group-hover:opacity-100
											transition-opacity duration-300
											">
											<GoPencil
												className="text-white text-xl cursor-pointer"
												onClick={(e) => setOpenEditImage(!openEditImage)}
											/>
										</div>
									</div>

									<div className="flex flex-col space-y-1">
										<h1 className={`${nunito.className} text-xl truncate`}>
											{data?.data?.username}
										</h1>
										<p className={`${poppins.className} text-sm truncate`}>
											{data?.data?.status}
										</p>
										<p className={`${poppins.className} text-sm truncate`}>
											Total Friends: {data?.data?.totalContacts}
										</p>
									</div>
								</div>
							</div>

							{/* Account Section */}
							<div className="mt-6 border-b border-gray-300 pb-5">
								<h1
									className={`${nunito.className} text-lg font-semibold flex flex-row gap-3 items-center`}>
									<IoKeyOutline /> Account
								</h1>
								<p
									className={`text-gray-600 text-[12px] ${poppins.className} mt-2`}>
									Last seen and Online
								</p>
								<p className={`truncate text-[15px] mt-1 ${poppins.className}`}>
									Everyone
								</p>
								<p
									className={`text-gray-600 mt-4 text-[12px] ${poppins.className}`}>
									Profile Photo
								</p>
								<p className={`text-[15px] truncate ${poppins.className}`}>
									Everyone
								</p>
							</div>

							{/* Email Section */}
							<div className="mt-5 border-b border-gray-300 pb-5">
								<h1
									className={`${nunito.className} text-base font-semibold flex flex-row gap-3 items-center`}>
									<MdOutlineEmail className="text-xl" /> Email
								</h1>
								<p
									className={`text-gray-800 text-[14px] mt-1 ${poppins.className}`}>
									Email helps you access your account. It isn't visible to
									others.
								</p>
								<p
									className={`text-gray-600 mt-3 text-[12px] ${poppins.className}`}>
									Email
								</p>
								<p
									className={`text-[15px] truncate flex flex-row gap-5 w-full justify-start items-center cursor-pointer z-50 font-bold ${poppins.className}`}
									onClick={(e) => setOpenEditEmail(!openEditEmail)}>
									{data?.data?.email} <GoPencil />
								</p>
								{openEditEmail && (
									<EditEmail setOpenEditEmail={setOpenEditEmail} />
								)}
								<p
									className={`mt-1 text-[#3a0657] flex flex-row gap-1 items-center font-bold text-[13px] ${poppins.className}`}>
									<CiCircleCheck
										className="text-base font-bold"
										strokeWidth={1}
									/>{" "}
									Verified
								</p>
							</div>

							{/* Phone Section */}
							<div className="mt-5 border-b border-gray-300 pb-5">
								<h1
									className={`${nunito.className} text-base font-semibold flex flex-row gap-2 items-center`}>
									<IoIosPhonePortrait className="text-2xl" /> Phone Number
								</h1>
								<p
									className={`text-gray-600 mt-3 text-[12px] ${poppins.className}`}>
									Phone
								</p>
								<p
									className={`text-[15px] truncate flex flex-row gap-5 w/full justify-start items-center cursor-pointer z-50 font-bold ${poppins.className}`}
									onClick={(e) => setOpenEditPhone(!openEditPhone)}>
									{data?.data?.phoneNumber} <GoPencil />
								</p>
								{openEditPhone && (
									<EditPhone setOpenEditPhone={setOpenEditPhone} />
								)}
								<p
									className={`mt-1 text-[#3a0657] flex flex-row gap-1 items-center font-bold text-[13px] ${poppins.className}`}>
									<CiCircleCheck
										className="text-base font-bold"
										strokeWidth={1}
									/>{" "}
									Verified
								</p>
							</div>

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
				{openEditImage && (
					<EditImage
						profilePicture={profilePicture}
						setOpenEditImage={setOpenEditImage}
					/>
				)}
			</div>
		</>,
		document.body
	);
});

export default DesktopSetting;
