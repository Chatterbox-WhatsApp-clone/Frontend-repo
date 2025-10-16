"use client";
import React, { useState } from "react";
import { useAuthenticatedStore, useUpdateUserStore } from "@/zustand";
import { FaTimes } from "react-icons/fa";

const EditBio = ({setOpenEditBio}) => {
	const [bio, setBio] = useState("");
	const [success, setSuccess] = useState(false);
	const [status, setStatus] = useState("");
	const { token } = useAuthenticatedStore();
	const { setUserUpdated } = useUpdateUserStore();

	const checkBioLength = () => {
		if (bio.length > 500) {
			setSuccess(false);
			setStatus("Bio cannot exceed 500 characters");
			setTimeout(() => {
				setStatus("");
			}, 5000);
			return false;
		} else {
			return true;
		}
	};

	const endpoint = process.env.NEXT_PUBLIC_COMPLETE_ENDPOINT;

	const sendUserDetailsToBackend = async (e) => {
		e?.preventDefault?.();
		if (!checkBioLength()) return;
		try {
			const res = await fetch(endpoint, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ bio }),
			});

			const data = await res.json();
			if (!res.ok) {
				setSuccess(false);
				setStatus(
					data.message || "Error updating bio address. Please try again later"
				);
				setTimeout(() => setStatus(""), 10000);
			} else {
				setSuccess(true);
				setStatus(data.message || "Bio successfully updated.");
				setUserUpdated(true);
				setTimeout(() => {
					setStatus("");
					setBio("");
                    setOpenEditBio(false);
				}, 5000);
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
					className={`hidden md:flex top-0 right-0 left-0 fixed inset-0 text-center text-white h-10  justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}
			<div
				className=" bg-gray-100 mt-1 py-2"
				onClick={(e) => e.stopPropagation()}>
				<FaTimes
					className="text-lg ml-4  cursor-pointer"
					onClick={(e) => setOpenEditBio(false)}
				/>
				<h3 className="text-base font-semibold text-center">Edit Bio</h3>
				<form className="pt-2 space-y-2 flex flex-col justify-center items-center">
					<textarea
						name="bio"
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						placeholder="Add bio"
						className="w-full sm:w-[90%] h-24 bg-white border-2 rounded-xl border-[#3a0657] outline-none text-gray-900 px-4 py-2 text-sm resize-none"
					/>

					<button
						onClick={sendUserDetailsToBackend}
						className={`px-6 bg-[#3a0657] py-2 rounded-full text-white w-auto`}>
						Update now
					</button>
				</form>
			</div>{" "}
		</>
	);
};

export default EditBio;
