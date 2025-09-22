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

	const uploadProfilePhoto = async (file) => {
		if (!file) return;
		try {
			const formData = new FormData();
			formData.append("profilePicture", file);

			const res = await fetch(uploadEndpoint, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(data.message || "Error uploading profile photo");
				setSuccess(false);
				setTimeout(() => setStatus(""), 10000);
			} else {
				setStatus(data.message || "Profile photo successfully uploaded");
				setSuccess(true);
				setUserUpdated(true);
				setTimeout(() => setStatus(""), 4000);
				setOpenEditImage(false);
			}
		} catch (error) {
			console.error("Error sending details to the backend:", error);
			setStatus(
				error.message || "Something went wrong. Please try again later."
			);
			setSuccess(false);
		}
	};

	const removeEndpoint = process.env.NEXT_PUBLIC_REMOVE_PROFILEIMAGE;
	const removeProfilePhoto = async () => {
		try {
			const res = await fetch(removeEndpoint, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(data.message || "Error removing profile photo");
				setSuccess(false);
			} else {
				setStatus(data.message || "Profile photo successfully removed.");
				setSuccess(true);
				setUserUpdated(true);
				setOpenEditImage(false);
			}
			setTimeout(() => setStatus(""), 10000);
		} catch (error) {
			console.error("Error sending details to the backend:", error);
			setStatus(
				error.message || "Something went wrong. Please try again later."
			);
			setSuccess(false);
		}
	};

	const handlePhotoUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		uploadProfilePhoto(file);
	};

	function handleInputRef() {
		fileRefInput.current.click();
	}

	return (
		<>
			{status && (
				<div
					className={`top-0 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}
			{viewImage && profilePicture && (
				<div className="fixed inset-0 z-[9999] bg-black/100 flex justify-center items-center px-3 py-3">
					{/* Close Icon */}
					<FaTimes
						className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
						onClick={() => {
							setViewImage(false);
							setOpenEditImage(false)
						}}
					/>

					{/* Image Container */}
					<div className="relative w-[85%] h-[85%] sm:w-[70%] sm:h-[70%] flex justify-center items-center">
						<Image
							src={profilePicture || "/assets/images/userImage.jpg"}
							alt="Preview"
							fill
							className="object-contain rounded-md"
						/>
					</div>
				</div>
			)}
			<div
				className="fixed top-[55px] left-10 bg-gray-200 border border-gray-300 z-[999] w-[125px] h-[105px] p-1 flex flex-col items-center rounded-md shadow-md"
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
		</>
	);
}
