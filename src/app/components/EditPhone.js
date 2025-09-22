"use client";
import React, { useState } from "react";
import { useAuthenticatedStore, useUpdateUserStore } from "@/zustand";
import { FaTimes } from "react-icons/fa";

export default function EditPhone({ setOpenEditPhone }) {
	const [phone, setPhone] = useState("");
	const [success, setSuccess] = useState(true);
	const [status, setStatus] = useState("");
	const { token } = useAuthenticatedStore();
	const { setUserUpdated } = useUpdateUserStore();

	const checkForAllFields = () => {
		if (!phone.includes("+")) {
			setSuccess(false);
			setStatus("Invalid phone number");
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
		if (!checkForAllFields()) return;
		try {
			const res = await fetch(endpoint, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ phoneNumber: phone }),
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(
					data.message || "Error updating phone number. Please try again later"
				);
				setSuccess(false);
				setTimeout(() => setStatus(""), 5000);
			} else {
				setSuccess(true);
				setStatus(data.message || "Phone number successfully updated.");
				setUserUpdated(true);
				setTimeout(() => {
					setStatus("");
					setPhone("");
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
					className={`top-0 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}

			<div
				className=" bg-gray-100 mt-1 py-1"
				onClick={(e) => e.stopPropagation()}>
				<FaTimes
					className="text-xl ml-4 cursor-pointer"
					onClick={(e) => setOpenEditPhone(false)}
				/>
				<h3 className="text-base font-semibold text-center">
					Edit Phone Number
				</h3>
				<form className="p-4 space-y-3 flex flex-col  justify-center items-center">
					<input
						type={"tel"}
						name="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder={"Phone Number"}
						className="w-full sm:w-[80%] h-10 bg-white border-2 rounded-3xl border-[#3a0657] outline-0 text-gray-900 px-4 text-sm"
					/>

					<button
						onClick={sendUserDetailsToBackend}
						className={`px-6 bg-[#3a0657] py-2 rounded-full text-white w-auto`}>
						Update now
					</button>
				</form>
			</div>
		</>
	);
}
