"use client";
import React, { useState, useRef } from "react";
import { Nunito, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthenticatedStore } from "@/zustand";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Page = () => {
	const router = useRouter();
	const [success, setSuccess] = useState(true);
	const [status, setStatus] = useState("");
	const { token } = useAuthenticatedStore();

	const [profilePhoto, setProfilePhoto] = useState(null);
	const [preview, setPreview] = useState(null)
	const fileRefInput = useRef();

	const handlePhotoUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setProfilePhoto(file);

		const reader = new FileReader()
		reader.onloadend = () => {
			setPreview(reader.result)
		}
		reader.readAsDataURL(file)
	};

	function handleInputRef() {
		fileRefInput.current.click();
	}

	const checkForAllFields = () => {
		if (!profilePhoto) {
			setSuccess(false);
			setStatus("Profile photo is required to complete your account setup");
			setTimeout(() => setStatus(""), 5000);
			return false;
		}
		return true;
	};

	const endpoint = process.env.NEXT_PUBLIC_PROFILE_UPLOAD_ENDPOINT;

	const sendUserDetailsToBackend = async (e) => {
		e.preventDefault();
		if (!checkForAllFields()) return;

		try {
			const formData = new FormData();
			formData.append("profilePicture", profilePhoto);

			const res = await fetch(endpoint, {
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
				setTimeout(() => setStatus(""), 1000);
				setTimeout(() => {
					router.push("/signup/congratulations");
				}, 2000);
			}
		} catch (error) {
			console.error("Error sending details to the backend:", error);
			setStatus(
				error.message || "Something went wrong. Please try again later."
			);
			setSuccess(false);
		}
	};

	return (
		<>
			{status && (
				<div
					className={`top-0 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
						}`}>
					{status}
				</div>
			)}
			<div className="h-screen w-full bg-gradient-to-b from-[#9b67b3] from-5% to-[#3a0657] flex flex-col px-1 relative">
				<div className="absolute top-4 left-4 flex flex-row gap-1 items-center">
					<Image
						src={"/assets/images/chatterbox-logo.png"}
						className="w-7 h-7 object-cover ml-2 mt-1"
						width={100}
						height={100}
						alt="logo"
					/>
					<p
						className={`text-[13px] mt-[3px] right-0 text-white ${poppins.className}`}>
						Chatterbox
					</p>
				</div>

				<main className="bg-white/10 backdrop-blur-md h-[90%] w-full sm:w-[450] sm:px-10 flex flex-col justify-center items-center mx-auto mt-3 px-3 shadow-lg border border-white/20 rounded-md">
					<p
						onClick={(e) => router.push("/")}
						className={`text-sm text-end ml-auto font-bold text-white ${poppins.className}`}>
						Skip
					</p>
					<p
						className={`text-3xl mt-4 font-bold text-white ${nunito.className}`}>
						Add a photo
					</p>
					<p
						className={`text-sm text-center font-bold text-white ${poppins.className}`}>
						Personalize your account with a photo. <br /> You can always change
						it later
					</p>

					<Image
						src={preview || "/assets/images/userImage.jpg"}
						width={100}
						height={100}
						alt="profileImage"
						className="w-40 h-40 rounded-full object-cover mt-10"
					/>
					<p className="text-sm text-center text-gray-200 mt-2">
						Accepted file types: JPG, PNG, JPEG. Max size: 5MB.
					</p>

					<button
						onClick={handleInputRef}
						className={`w-48 mt-3 flex justify-center items-center py-2 cursor-pointer rounded-full bg-white text-sm ${poppins.className}`}>
						Upload Profile Photo
					</button>
					<input
						type="file"
						accept="image/*"
						onChange={handlePhotoUpload}
						className="hidden"
						ref={fileRefInput}
					/>
					<p className="text-sm text-center text-gray-200 mt-7">
						Finish & Create Account
					</p>
					<button
						onClick={sendUserDetailsToBackend}
						className={`w-48 mt-3 flex justify-center items-center py-2 cursor-pointer rounded-full bg-white ${poppins.className}`}>
						Finish
					</button>
				</main>
			</div>
		</>
	);
};

export default Page;
