"use client";
import React, { useState, useRef } from "react";
import { PulseLoader } from "react-spinners";
import { useAuthenticatedStore } from "@/zustand";
import { useRouter } from "next/navigation";

const DeleteAccount = ({ setShowDesktopSetting }) => {
	const { token } = useAuthenticatedStore();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [deleteAccount, setDeleteAccount] = useState(false);

	const btnRef = useRef(null); // === NEW

	const deleteUser = async () => {
		setLoading(true);

		const endpoint = process.env.NEXT_PUBLIC_DELETE_ACCOUNT;

		try {
			const res = await fetch(endpoint, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.ok) {
				// Remove token from localStorage
				localStorage.removeItem("token");

				setTimeout(() => {
					router.push("/"); // Redirect after deleting token
				}, 5000);
			} else {
				console.error("Failed to delete your account");
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* Container must be relative for the modal to sit on top */}
			<div className="flex ml-[30%] justify-center items-center w-36 relative">
				<button
					ref={btnRef}
					onClick={() => {
						setDeleteAccount(true);
					}}
					className="flex-1 bg-red-600 text-white rounded-md py-2 font-semibold hover:bg-red-700">
					Delete Account
				</button>

				{deleteAccount && (
					<div
						className="absolute top-14 left-1/2 -translate-x-1/2 -translate-y-full 
                        flex flex-col items-center z-[99] bg-white shadow-lg shadow-gray-400 p-6 rounded-xl w-[300px]">
						<p className="text-gray-800 text-center mb-4 font-medium">
							Are you sure you want to delete your account? This action is
							irreversible.
						</p>

						<div className="flex flex-row justify-between w-full gap-3">
							<button
								onClick={() => setDeleteAccount(false)}
								className="flex-1 bg-gray-200 px-1 text-gray-800 rounded-md py-2 font-semibold hover:bg-gray-300">
								Cancel
							</button>

							<button
								onClick={deleteUser}
								className="flex-1 bg-red-600 text-white rounded-md py-2 px-1 font-semibold hover:bg-red-700">
								{loading ? <PulseLoader size={3} /> : "Delete Account"}
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default DeleteAccount;
