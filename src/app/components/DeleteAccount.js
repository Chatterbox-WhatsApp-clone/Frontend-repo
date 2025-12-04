"use client";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import {
	useAuthenticatedStore,
} from "@/zustand";
import Modal from "@/app/components/Modal";
import { useRouter } from "next/navigation";
const DeleteAccount = () => {
	const { token } = useAuthenticatedStore();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [deleteAccount, setDeleteAccount] = useState(false);

	const deleteUser = async () => {
		setLoading(true);
		const endpoint = process.env.NEXT_PUBLIC_DELETE_ACCOUNT;
		NEXT_PUBLIC_DELETE_ACCOUNT;
		try {
			const res = await fetch(endpoint, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.ok) {
				router.push("/");
			} else {
				console.error("Failed to Delete your account ");
				setSuccess(false);
			}
		} catch (err) {
			console.error("Error sending request:", err);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<div className="flex justify-center items-center w-full">
				<button
					onClick={() => setDeleteAccount(true)}
					
					className="flex-1 bg-red-600 text-white rounded-md py-2 font-semibold hover:bg-red-700">
					Delete Account
				</button>
			</div>
			{deleteAccount && (
				<Modal>
					<div className="flex flex-col items-center bg-white shadow-lg shadow-gray-400 p-6 rounded-xl max-w-sm w-[90%]">
						<p className="text-gray-800 text-center mb-4 font-medium">
							Are you sure you want to delete your account? This action is
							irreversible.
						</p>
						<div className="flex flex-row justify-between w-full gap-3">
							<button
								onClick={() => setDeleteAccount(false)}
								id="cancelBtn"
								className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2 font-semibold hover:bg-gray-300">
								Cancel
							</button>
							<button
								onClick={deleteUser}
								id="blockBtn"
								className="flex-1 bg-red-600 text-white rounded-md py-2 font-semibold hover:bg-red-700">
								{loading ? <PulseLoader size={3} /> : "Delete Account"}
							</button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default DeleteAccount;
