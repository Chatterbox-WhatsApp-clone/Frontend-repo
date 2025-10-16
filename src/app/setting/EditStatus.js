"use client";
import React, { useState } from "react";
import { useAuthenticatedStore, useUpdateUserStore } from "@/zustand";
import { FaTimes } from "react-icons/fa";

const EditStatus = ({ setOpenEditStatus }) => {
	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(false);
	const [updatedStatus, setUpdatedStatus] = useState("");
	const { token } = useAuthenticatedStore();
	const { setUserUpdated } = useUpdateUserStore();

	const checkstatusLength = () => {
		if (status.trim() === "") {
			setSuccess(false);
			setStatus("Status cannot be empty");
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
		if (!checkstatusLength()) return;
		try {
			const res = await fetch(endpoint, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status }),
			});

			const data = await res.json();
			if (!res.ok) {
				setSuccess(false);
				setUpdatedStatus(
					data.message ||
						"Error updating status address. Please try again later"
				);
				setTimeout(() => setStatus(""), 10000);
			} else {
				setSuccess(true);
				setUpdatedStatus(data.message || "status successfully updated.");
				setUserUpdated(true);
				setTimeout(() => {
					setStatus("");
					setUpdatedStatus("")
					setOpenEditStatus(false);
				}, 5000);
			}
		} catch (error) {
			console.error("Error sending details to the backend:", error);
			setUpdatedStatus(
				error.message || "Something went wrong. Please try again later."
			);
			setSuccess(false);
		}
	};

	return (
		<>
			{updatedStatus && (
				<div
					className={`hidden md:flex top-0 right-0 left-0 fixed inset-0 text-center text-white h-10  justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{updatedStatus}
				</div>
			)}
			<div
				className="w-[100%] bg-gray-100 mt-1 py-2 "
				onClick={(e) => e.stopPropagation()}>
				<FaTimes
					className="text-lg ml-4  cursor-pointer"
					onClick={(e) => setOpenEditStatus(false)}
				/>
				<h3 className="text-base font-semibold text-center">Edit status</h3>
				<form className="pt-2 space-y-2 flex flex-col justify-center items-center">
					<input
						type={"text"}
						name="Status"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						placeholder={"Status"}
						className="w-full sm:w-[80%] h-10 bg-white border-2 rounded-3xl border-[#3a0657] outline-0 text-gray-900 px-4 text-sm"
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

export default EditStatus;
