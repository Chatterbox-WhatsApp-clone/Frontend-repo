"use client";
import React from "react";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { useAuthenticatedStore } from "@/zustand";
import { useRouter } from "next/navigation";
import GoogleLogIn from "./GoogleLogIn";
import Image from "next/image";

const Page = () => {
	const [success, setSuccess] = useState(true);
	const [showPassword, setShowPassord] = useState(false);
	const [status, setStatus] = useState("");
	const [touched, setTouched] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setAuthenticated, setToken } = useAuthenticatedStore();

	const router = useRouter();

	function backToHomePage() {
		router.push("/");
	}
	function backToSignUpPage() {
		router.push("/signup");
	}
	function toForgotPasswordPage() {
		router.push("/login/forgotpassword");
	}

	const checkForAllFields = () => {
		if (email.trim() === "" || password.trim() === "") {
			setSuccess(false);
			setStatus("Please input all fields and try again");
			setTimeout(() => {
				setStatus("");
			}, 5000);
			return false;
		} else if (!email.includes("@")) {
			setSuccess(false);
			setStatus("Email address is invalid");
			setTimeout(() => {
				setStatus("");
			}, 5000);
			return false;
		} else if (password.length < 6) {
			setSuccess(false);
			setStatus("Password must be at least 6 characters long");
			setTimeout(() => {
				setStatus("");
			}, 5000);
			return false;
		} else {
			return true;
		}
	};
	const endpoint = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT;

	const sendUserDetailsToBackend = async (e) => {
		e.preventDefault();
		if (!checkForAllFields()) return;
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			});
			const data = await res.json();

			if (!res.ok) {
				setStatus(
					data.message ||
					"Login failed. Please check your email and password and try again."
				);
				setSuccess(false);
				setTimeout(() => setStatus(""), 10000);
			} else {
				setStatus(data.message || "Login successful");
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
		}
	};
	return (
		<>
			{status && (
				<div
					className={`top-2 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
						}`}>
					{status}
				</div>
			)}
			<div className="h-screen w-full bg-gradient-to-b from-[#9b67b3] from-5% to-[#3a0657] flex flex-col justify-center items-center relative">
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
				<div className="flex justify-center items-center relative h-full w-full">
					<main className="bg-white/10 backdrop-blur-md h-auto w-full sm:w-[450px] sm:px-10 flex flex-col justify-center items-center mx-auto mt-3 px-3 py-4 shadow-lg border border-white/20 rounded-md">
						<h1
							className={`flex items-center gap-2 font-bold text-xl sm:text-2xl mt-5 text-gray-200 ${nunito.className}`}>
							Welcome back! Sign in to continue your conversations.
						</h1>
						<form className="w-full space-y-2 xs:w-[250px] sm:w-[450px] py-4 flex flex-col justify-center items-center">
							<input
								type="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								className="w-full xs:w-[85%] sm:w-[90%] h-10 rounded-3xl bg-white/70 backdrop-blur-sm text-gray-700 px-4 text-sm"
							/>
							<div className="w-full xs:w-[85%] sm:w-[90%] relative">
								<input
									type={`${showPassword ? "text" : "password"}`}
									name="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									onFocus={(e) => setTouched(true)}
									placeholder={"Password"}
									className="w-full h-10 rounded-3xl bg-white/70 backdrop-blur-sm text-gray-700 px-4  text-sm"
								/>

								{touched && password.length > 0 && (
									<span
										className="absolute top-2/4 -translate-y-1/2 right-3 cursor-pointer"
										onClick={(e) => setShowPassord(!showPassword)}>
										{showPassword ? <FaEye /> : <FaEyeSlash />}
									</span>
								)}
							</div>
							<p
								onClick={toForgotPasswordPage}
								className={`text-end text-[12px] right-0 text-white ml-auto mr-2 sm:mr-8 cursor-pointer underline ${poppins.className}`}>
								Forgot Password?
							</p>
						</form>

						<button
							onClick={sendUserDetailsToBackend}
							className={`text-center bg-white h-10 rounded-3xl w-80 mx-2 gap-2 font-bold cursor-pointer ${poppins.className}`}
							type="submit">
							Log In
						</button>
						<p className="or text-white mt-5 font-bold">or Login with</p>
						<GoogleLogIn />
						<p className="text-white mt-10" onClick={backToSignUpPage}>
							Don&apos;'t have an account?{" "}
							<span className="font-bold cursor-pointer underline">
								Sign Up
							</span>
						</p>
					</main>
				</div>
			</div>
		</>
	);
};

export default Page;
