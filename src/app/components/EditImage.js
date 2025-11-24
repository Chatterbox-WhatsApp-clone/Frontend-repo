"use client";
import React, { useState, useRef } from "react";
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import Image from "next/image";
import { useAuthenticatedStore, useUpdateUserStore } from "@/zustand";
import { FaTimes } from "react-icons/fa";

export default function EditImage({ profilePicture, setOpenEditImage }) {
	const fileRefInput = useRef();
	const [success, setSuccess] = useState(true);
	const [status, setStatus] = useState("");
	const [viewImage, setViewImage] = useState(false);
	const { token } = useAuthenticatedStore();
	const { setUserUpdated } = useUpdateUserStore();

	const uploadEndpoint = process.env.NEXT_PUBLIC_PROFILE_UPLOAD_ENDPOINT;
	const removeEndpoint = process.env.NEXT_PUBLIC_REMOVE_PROFILEIMAGE;

	const uploadProfilePhoto = async (file) => {
		if (!file) return;
		try {
			const formData = new FormData();
			formData.append("profilePicture", file);

			const res = await fetch(uploadEndpoint, {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: formData,
			});
			const data = await res.json();

			if (!res.ok) {
				setStatus(data.message || "Error uploading profile photo");
				setSuccess(false);
			} else {
				setStatus(data.message || "Profile photo successfully uploaded");
				setSuccess(true);
				setUserUpdated(true);
				setTimeout(() => setStatus(""), 4000);
				setOpenEditImage(false);
			}
			setTimeout(() => setStatus(""), 8000);
		} catch (error) {
			console.error("Upload error:", error);
			setStatus(error.message || "Something went wrong");
			setSuccess(false);
		}
	};

	const removeProfilePhoto = async () => {
		try {
			const res = await fetch(removeEndpoint, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();

			if (!res.ok) {
				setStatus(data.message || "Error removing profile photo");
				setSuccess(false);
			} else {
				setStatus(data.message || "Profile photo successfully removed");
				setSuccess(true);
				setUserUpdated(true);
				setOpenEditImage(false);
			}
			setTimeout(() => setStatus(""), 8000);
		} catch (error) {
			console.error("Remove error:", error);
			setStatus(error.message || "Something went wrong");
			setSuccess(false);
		}
	};

	const handlePhotoUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		uploadProfilePhoto(file);
	};

	const handleInputRef = () => fileRefInput.current.click();

	return (
		<>
			{status && (
				<div
					className={`fixed top-0 right-0 left-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-[10000] text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}

			<div
				className="relative bg-transparent"
				onClick={() => setOpenEditImage(false)}>
				<div
					className=" bg-gray-200 border border-gray-300 z-[999] w-[125px] h-[105px] p-1 flex flex-col items-center rounded-md shadow-md"
					onClick={(e) => e.stopPropagation()}>
					<div className="w-full h-full rounded-md flex flex-col justify-center items-center space-y-1">
						<button
							onClick={() => setViewImage(true)}
							className={`px-1 py-1 text-[13px] hover:bg-gray-300 rounded-md w-full text-center ${poppins.className}`}>
							View Image
						</button>
						<button
							className={`px-1 py-1 text-[13px] hover:bg-gray-300 rounded-md w-full text-center ${poppins.className}`}
							onClick={handleInputRef}>
							Change Image
						</button>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							ref={fileRefInput}
							onChange={handlePhotoUpload}
						/>
						<button
							onClick={removeProfilePhoto}
							className={`px-1 rounded-md w-full py-1 text-[13px] hover:bg-gray-300 text-center ${poppins.className}`}>
							Remove Image
						</button>
					</div>
				</div>
			</div>

			{/* ✅ View image modal */}
			{viewImage && profilePicture && (
				<div
					className="fixed inset-0 z-[9999] bg-black/100 flex justify-center items-center px-3 py-3"
					onClick={() => setViewImage(false)}>
					<FaTimes
						className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
						onClick={() => {
							setViewImage(false);
						}}
					/>
					<div
						className="relative w-[85%] h-[85%] sm:w-[70%] sm:h-[70%] flex justify-center items-center"
						onClick={(e) => e.stopPropagation()}>
						<Image
							src={profilePicture || "/assets/images/userImage.jpg"}
							alt="Preview"
							fill
							className="object-contain rounded-md"
						/>
					</div>
				</div>
			)}
		</>
	);
}
