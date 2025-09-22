"use client";
import React, { useState, useEffect } from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedStore, useUpdateUserStore } from "@/zustand";
import Spinner from "@/Spinner";
import { IoKeyOutline } from "react-icons/io5";
import {
	MdOutlineEmail,
	MdOutlineDeleteOutline,
	MdOutlinePrivacyTip,
} from "react-icons/md";
import { IoIosPhonePortrait } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import Security from "./Security";
import EditEmail from "../components/EditEmail";
import EditImage from "../components/EditImage";
import EditPhone from "../components/EditPhone";

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

	const [linkCopied, setLinkCopied] = useState(false);
	const [openEditEmail, setOpenEditEmail] = useState(false);
	const [openEditPhone, setOpenEditPhone] = useState(false);
	const [openEditImage, setOpenEditImage] = useState(false);

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

	// Refetch whenever userUpdated changes
	useEffect(() => {
		if (userUpdated) {
			refetch();
			setUserUpdated(false);
		}
	}, [userUpdated, refetch, setUserUpdated]);

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
		<div className="block md:hidden w-full h-full bg-gray-50 px-5 pb-20 overflow-y-auto">
			{/* Profile Section */}
			<div className="mt-4 flex items-center space-x-4">
				<div className="w-20 h-20 relative group">
					<Image
						src={profilePicture}
						alt="User image"
						fill
						className="object-cover rounded-full"
						sizes="64px"
					/>
					<div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
						<GoPencil
							className="text-white text-xl cursor-pointer"
							onClick={() => setOpenEditImage(true)}
						/>
					</div>
				</div>
				<div className="flex flex-col space-y-1">
					<h1 className={`${nunito.className} text-2xl truncate`}>
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

			{/* Account Section */}
			<div className="mt-8 border-b border-gray-300 pb-5">
				<h1
					className={`${nunito.className} text-xl font-semibold flex items-center gap-3`}>
					<IoKeyOutline /> Account
				</h1>
				<p className={`${poppins.className} text-gray-600 text-[12px] mt-2`}>
					Last seen and Online
				</p>
				<p className={`${poppins.className} truncate text-[15px] mt-1`}>
					Everyone
				</p>
			</div>

			{/* Email Section */}
			<div className="mt-5 border-b border-gray-300 pb-5">
				<h1
					className={`${nunito.className} text-base font-semibold flex items-center gap-3`}>
					<MdOutlineEmail className="text-xl" /> Email
				</h1>
				<p className={`${poppins.className} text-gray-800 text-[14px] mt-1`}>
					Email helps you access your account. It isn't visible to others.
				</p>
				<p
					className="text-[15px] truncate flex items-center justify-between cursor-pointer font-bold mt-3"
					onClick={() => setOpenEditEmail(true)}>
					{data?.data?.email} <GoPencil />
				</p>
				<p className="mt-1 flex items-center gap-1 text-[#3a0657] font-bold text-[13px]">
					<CiCircleCheck strokeWidth={1} /> Verified
				</p>
				{openEditEmail && <EditEmail setOpenEditEmail={setOpenEditEmail} />}
			</div>

			{/* Phone Section */}
			<div className="mt-5 border-b border-gray-300 pb-5">
				<h1
					className={`${nunito.className} text-base font-semibold flex items-center gap-2`}>
					<IoIosPhonePortrait className="text-2xl" /> Phone Number
				</h1>
				<p className={`${poppins.className} text-gray-600 text-[12px] mt-3`}>
					Phone
				</p>
				<p
					className="text-[15px] truncate flex items-center justify-between cursor-pointer font-bold mt-1"
					onClick={() => setOpenEditPhone(true)}>
					{data?.data?.phoneNumber} <GoPencil />
				</p>
				<p className="mt-1 flex items-center gap-1 text-[#3a0657] font-bold text-[13px]">
					<CiCircleCheck strokeWidth={1} /> Verified
				</p>
				{openEditPhone && <EditPhone setOpenEditPhone={setOpenEditPhone} />}
			</div>

			{/* Privacy Section */}
			<div className="mt-5 border-b border-gray-300 pb-5">
				<h1
					className={`${nunito.className} text-base font-semibold flex items-center gap-3`}>
					<MdOutlinePrivacyTip className="text-xl" /> Privacy
				</h1>
				<p className={`${poppins.className} mt-2 text-[15px]`}>
					Blocked Friends: {data?.data?.totalBlocked}
				</p>
			</div>

			<Security />

			{/* Invite Friend */}
			<div className="mt-5 border-b border-gray-300 pb-5 flex items-center justify-between">
				<p className={`${poppins.className} text-[15px]`}>Invite a friend</p>
				<button
					onClick={handleCopyLink}
					className="text-[#3a0657] font-bold cursor-pointer underline">
					{linkCopied ? "Link Copied!" : "Copy Link"}
				</button>
			</div>

			{/* Delete Account */}
			<div className="mt-3 flex justify-center">
				<button className="bg-red-600 text-white px-5 py-2 rounded flex items-center gap-2 hover:bg-red-700">
					<MdOutlineDeleteOutline /> Delete Account
				</button>
			</div>

			{/* Edit Image Modal */}
			{openEditImage && (
				<EditImage
					profilePicture={profilePicture}
					setOpenEditImage={setOpenEditImage}
				/>
			)}
		</div>
	);
};

export default Page;
