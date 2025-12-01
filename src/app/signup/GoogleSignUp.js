"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInButton } from "@/utils/GoogleSignIn";
import { useAuthenticatedStore } from "@/zustand";

const GoogleSignUp = () => {
	const { setToken } = useAuthenticatedStore();
	const router = useRouter();

	// user info
	const password = "abc123";
	const phoneNumber = "+12377773233";

	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(true);

	const endpoint = process.env.NEXT_PUBLIC_AUTH_REGISTRATION_ENDPOINT;

	function toUploadImagePage() {
		router.push("/complete");
	}

	function toSignUpPage() {
		router.push("/signup");
	}

	// send user details to backend
	const sendUserDetailsToBackend = async (user) => {
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: user.displayName,
					email: user.email,
					password: password,
					phoneNumber: phoneNumber,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(data.message || "Error creating profile");
				setSuccess(false);
				setTimeout(() => setStatus(""), 10000);
				toSignUpPage();
				throw new Error(data?.message);
			} else {
				setStatus("Account successfully created");
				setSuccess(true);
				setTimeout(() => setStatus(""), 10000);

				setToken(data?.data?.token);
				setTimeout(() => {
					toUploadImagePage();
				}, 5000);
			}
		} catch (error) {
			console.error("Error sending details to the backend:", error);
			setStatus(
				error.message || "Something went wrong. Please try again later."
			);
			setSuccess(false);
			setSuccess(false);
			toSignUpPage();
		}
	};

	// Google Sign-In
	const signIn = async () => {
		try {
			const signedUser = await signInButton();

			if (!signedUser) {
				setStatus("Google sign-in failed. Please try again.");
				setSuccess(false);
				setTimeout(() => setStatus(""), 5000);
				return;
			}

			sendUserDetailsToBackend(signedUser);
		} catch (error) {
			console.error("Sign-in error:", error);
			setStatus(error?.message || "Google sign-in failed. Please try again.");
			setSuccess(false);
			setTimeout(() => setStatus(""), 5000);
		}
	};

	return (
		<>
			{status && (
				<div
					className={`top-0 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto  ${success ? "bg-green-600 px-3 py-3 rounded-md" : "bg-red-600"
						}`}>
					{status}
				</div>
			)}

			<button
				onClick={signIn}
				className="flex items-center justify-center bg-white h-10 rounded-3xl mt-5 w-full sm:w-80 mx-2 gap-2 cursor-pointer">
				Continue with{" "}
				<Image
					src="/assets/images/google1.jpeg"
					alt="google icon"
					width={20}
					height={20}
					className="rounded-full"
				/>
			</button>
		</>
	);
};

export default GoogleSignUp;
