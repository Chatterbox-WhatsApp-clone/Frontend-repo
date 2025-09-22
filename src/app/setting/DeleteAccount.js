"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuthenticatedStore } from "@/zustand";

export default function DeleteAccount() {
	const router = useRouter();
	const { token } = useAuthenticatedStore(); // adjust if your hook returns differently
	const userEndpoint = process.env.NEXT_PUBLIC_GET_USER_ENDPOINT;

	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// cleanup any lingering timers if component unmounts
		return () => {
			// nothing to clean now; timeouts are cleared inside handlers
		};
	}, []);

	const handleDelete = async () => {
		// basic confirmation to avoid accidental deletes
		const ok = confirm(
			"Are you sure you want to delete your account? This action is irreversible."
		);
		if (!ok) return;

		setLoading(true);
		try {
			const res = await fetch(userEndpoint, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				setSuccess(false);
				setStatus(
					data.message || "Failed to delete account. Please try again."
				);
				// auto-hide the message
				setTimeout(() => setStatus(""), 5000);
			} else {
				setSuccess(true);
				setStatus(data.message || "Account deleted. Redirecting...");
				// show success message briefly then redirect
				setTimeout(() => {
					setStatus("");
					// push to home
					router.push("/");
				}, 1700);
			}
		} catch (err) {
			console.error("Error deleting account:", err);
			setSuccess(false);
			setStatus(err.message || "Something went wrong. Please try again.");
			setTimeout(() => setStatus(""), 5000);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* status banner */}
			{status && (
				<div
					role="status"
					aria-live="polite"
					className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 text-sm text-white px-4 py-2 rounded-md shadow-md ${
						success ? "bg-green-600" : "bg-red-600"
					}`}>
					{status}
				</div>
			)}

			{/* Delete button */}
			<div className="mt-3 flex justify-center">
				<button
					onClick={handleDelete}
					disabled={loading}
					className={`flex items-center gap-2 px-5 py-2 rounded ${
						loading
							? "bg-red-400 cursor-not-allowed"
							: "bg-red-600 hover:bg-red-700"
					} text-white`}>
					<MdOutlineDeleteOutline />
					{loading ? "Deleting..." : "Delete Account"}
				</button>
			</div>
		</>
	);
}
