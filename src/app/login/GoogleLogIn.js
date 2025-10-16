"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInButton } from "@/utils/GoogleSignIn";
import { useAuthenticatedStore } from "@/zustand";

const GoogleLogIn = () => {
	const router = useRouter();
	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(true);
	const { setAuthenticated, setToken } = useAuthenticatedStore();

	function backToHomePage() {
		router.push("/");
	}
	// send user details to backend
	const endpoint = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENDPOINT;
	const sendUserDetailsToBackend = async (user) => {
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: user.username,
					email: user.email,
					profilePicture: '',
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(
					"Login failed. Please check your email and password and try again."
				);
				setSuccess(false);
				setTimeout(() => setStatus(""), 10000);
				toSignUpPage();
			} else {
				setStatus(data?.message || "Login successful");
				setSuccess(true);
				setTimeout(() => setStatus(""), 10000);
				setAuthenticated(true);
				setToken(data?.data?.token);
				setTimeout(() => {
					backToHomePage();
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
					className={`top-0 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${
						!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
					}`}>
					{status}
				</div>
			)}
			<button
				onClick={signIn}
				className="flex items-center justify-center bg-white h-10 rounded-3xl mt-5 w-80 mx-2 gap-2 cursor-pointer">
				Login with{" "}
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

export default GoogleLogIn;
