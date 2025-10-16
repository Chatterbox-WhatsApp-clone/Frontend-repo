"use client";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { useAuthenticatedStore } from "@/zustand";
const Page = () => {
	const [success, setSuccess] = useState(true);
	const [showPassword, setShowPassord] = useState(false);
	const [status, setStatus] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [touched, setTouched] = useState(false);
	const { token } = useAuthenticatedStore();
	// for routing
	const router = useRouter();

	function backToWelcomePage() {
		router.push("/");
	}
	function toUploadImagePage() {
		router.push("verification");
	}
	// for routing

	// form fields
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	// form fields

	// FOR REGISTERING USERS
	const checkForAllFields = () => {
		if (password.trim() === "" || phoneNumber.trim() === "") {
			setSuccess(false);
			setStatus("Please input all fields and try again");
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
		} else if (!phoneNumber.includes("+")) {
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
		e.preventDefault();
		if (!checkForAllFields()) return;
		try {
			const res = await fetch(endpoint, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					password: password,
					phoneNumber: phoneNumber,
				}),
			});
			const data = await res.json();

			if (!res.ok) {
				setStatus(data.message || "Phone Number is already in use");
				setSuccess(false);
				setTimeout(() => setStatus(""), 10000);
				throw new Error(data.message);
			} else {
				setStatus(data.message || "Profile Completed");
				setSuccess(true);
				setTimeout(() => setStatus(""), 10000);
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
		}
	};

	// FOR REGISTERING USERS
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

			<div className="h-screen w-full bg-gradient-to-b from-[#9b67b3] from-5% to-[#3a0657] flex flex-col px-1">
				<div className="flex flex-row gap-1 items-center">
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
					<main className="bg-white/10 backdrop-blur-md h-auto w-full sm:w-auto sm:px-10 flex flex-col justify-center items-center mx-auto mt-3 px-3 py-4 shadow-lg border border-white/20 rounded-md">
						<h1
							className={`flex items-center gap-2 font-bold text-xl sm:text-2xl mt-5 text-gray-200 ${nunito.className}`}>
							Complete Your Profile .
						</h1>

						<form
							method="POST"
							className="w-full space-y-2 xs:w-[250px] sm:w-[450px] py-4 flex flex-col justify-center items-center">
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
										className="absolute top-2/4 -translate-y-1/2 right-3 "
										onClick={(e) => setShowPassord(!showPassword)}>
										{showPassword ? <FaEye /> : <FaEyeSlash />}
									</span>
								)}
							</div>

							<div className="w-full s:w-[85%] sm:w-[90%] relative">
								<input
									type={`${"password"}`}
									name="Password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									onFocus={(e) => setTouched(true)}
									placeholder={"Confirm Password"}
									className="w-full h-10 rounded-3xl bg-white/70 backdrop-blur-sm text-gray-700 px-4 text-sm"
								/>

								<span
									className={` absolute top-2/4 -translate-y-1/2 right-3 text-[18px] ${
										confirmPassword === password
											? "text-green-500"
											: "text-red-500"
									}`}>
									{touched &&
										confirmPassword.length > 0 &&
										(confirmPassword === password ? (
											<IoIosCheckmarkCircleOutline className="text-green-700 text-xl" />
										) : (
											<MdErrorOutline className="text-red-500 text-xl" />
										))}
								</span>
							</div>

							<input
								type={"tel"}
								name="Phone Number"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								placeholder={"Phone number"}
								className="w-full xs:w-[85%] sm:w-[90%] h-10 rounded-3xl bg-white/70 backdrop-blur-sm text-gray-700 px-4 text-sm"
							/>

							<button
								onClick={sendUserDetailsToBackend}
								className={`text-center bg-white h-10 rounded-3xl mt-3 w-80 mx-2 gap-2 font-bold cursor-pointer ${poppins.className}`}
								type="submit">
								Complete Profile
							</button>
						</form>
					</main>
				</div>
			</div>
		</>
	);
};

export default Page;
