"use client";
import React, { useEffect, useState } from "react";
import {
	useAuthenticatedStore,
	useUpdateUserStore,
	useUserData,
} from "@/zustand";
import { GoPencil } from "react-icons/go";
import Image from "next/image";

const BackgroundImage = () => {
	const [success, setSuccess] = useState(false);
	const [status, setStatus] = useState("");
	const { token } = useAuthenticatedStore();
	const { setUserUpdated } = useUpdateUserStore();
	const { user } = useUserData();

	const handleUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("backgroundImage", file);

		try {
			const res = await fetch(process.env.NEXT_PUBLIC_ADD_BACKGROUND_IMAGE, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});
			const data = await res.json();

			if (res.ok) {
				setSuccess(true);
				setStatus("Background image updated successfully!");
				setUserUpdated(true);
			} else {
				setSuccess(false);
				setStatus(data.message || "Failed to update background image");
			}
		} catch (error) {
			setSuccess(false);
			setStatus("Something went wrong. Try again.");
			console.error(error);
		}

		setTimeout(() => setStatus(""), 3000);
	};

	// url for image
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const userBackgroundImage = user?.data?.backgroundImage
		? `${backendBase}${user.data.backgroundImage}`
		: "/assets/images/userImage.jpg";
	// url for image
	return (
		<>
			{status && (
				<div
					className={`flex top-0 right-0 left-0 fixed inset-0 text-center text-white h-10 justify-center items-center w-full sm:w-[380px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}

			{/* ✅ Background section */}
			<div
				key={user?._id}
				className="h-64 w-full md:rounded-t-lg bg-gray-200 relative mt-[2px] shrink-0">
				<Image
					src={userBackgroundImage}
					alt="image"
					fill
					className="object-cover object-center size-96 shrink-0"
					priority
				/>
				<div className="absolute bottom-1 right-2 flex items-center gap-2 z-10">
					<label
						htmlFor="bg-upload"
						className="bg-[#3a0657] text-white px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-1 hover:bg-[#5a0a7a] transition">
						<GoPencil /> Change
					</label>
					<input
						type="file"
						id="bg-upload"
						accept="image/*"
						onChange={handleUpload}
						className="hidden"
					/>
				</div>
			</div>
		</>
	);
};

export default BackgroundImage;
