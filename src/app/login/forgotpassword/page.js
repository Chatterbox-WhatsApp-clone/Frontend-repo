"use client";
import React, { useState } from "react";
import { Nunito, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Image from "next/image";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900", "1000"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Page = () => {
	const router = useRouter();

	const [success, setSuccess] = useState(true);
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");
	const [sent, setSent] = useState(false);

	// 👁️ password visibility states
	const [showPassword, setShowPassword] = useState(false);
	const [touched, setTouched] = useState(false);

	const forgotEndpoint = process.env.FORGOT_PASSWORD_ENDPOINT;
	const resetEndpoint = process.env.RESET_PASSWORD_ENDPOINT;

	const checkEmail = () => {
		if (email.trim() === "") {
			setStatus("Please enter email and try again");
			setSuccess(false);
			setTimeout(() => setStatus(""), 5000);
			return false;
		} else if (!email.includes("@")) {
			setStatus("Email address is invalid");
			setSuccess(false);
			setTimeout(() => setStatus(""), 5000);
			return false;
		}
		return true;
	};

	const checkForAllFields = () => {
		if (email.trim() === "" || password.trim() === "" || code.trim() === "") {
			setSuccess(false);
			setStatus("Please input all fields and try again");
			setTimeout(() => setStatus(""), 5000);
			return false;
		} else if (!email.includes("@")) {
			setSuccess(false);
			setStatus("Email address is invalid");
			setTimeout(() => setStatus(""), 5000);
			return false;
		} else if (password.length < 6) {
			setSuccess(false);
			setStatus("Password must be at least 6 characters long");
			setTimeout(() => setStatus(""), 5000);
			return false;
		} else if (code.length !== 6) {
			setSuccess(false);
			setStatus("Code must be exactly 6 digits");
			setTimeout(() => setStatus(""), 5000);
			return false;
		}
		return true;
	};

	const sendResetEmail = async (e) => {
		e.preventDefault();
		if (!checkEmail()) return;
		try {
			const res = await fetch(forgotEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(data?.message || "Error sending reset code");
				setSuccess(false);
				setTimeout(() => setStatus(""), 5000);
			} else {
				setStatus(`Password reset code sent to ${email}`);
				setSuccess(true);
				setSent(true);
				setTimeout(() => setStatus(""), 5000);
			}
			setTimeout(() => setStatus(""), 5000);
		} catch (error) {
			setStatus(error.message || "Something went wrong. Try again later.");
			setSuccess(false);
		}
	};

	const resetPassword = async (e) => {
		e.preventDefault();
		if (!checkForAllFields()) return;
		try {
			const res = await fetch(resetEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email, code: code, password: password }),
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(data.message);
				setSuccess(false);
				setTimeout(() => setStatus(""), 5000);
			} else {
				setStatus(data.message || "Password reset successful");
				setSuccess(true);
				setTimeout(() => setStatus(""), 5000);
				setTimeout(() => router.push("/"), 2000);
			}
			setTimeout(() => setStatus(""), 5000);
		} catch (error) {
			setStatus(error.message || "Something went wrong. Try again later.");
			setSuccess(false);
			setTimeout(() => setStatus(""), 5000);
		}
	};

	return (
		<>
			{status && (
				<div
					className={`fixed top-4 inset-x-0 mx-auto text-center text-white py-2 px-4 rounded-md w-fit z-50 ${
						success ? "bg-green-600" : "bg-red-600"
					}`}>
					{status}
				</div>
			)}

			<div className="h-screen w-full bg-gradient-to-b from-[#9b67b3] to-[#3a0657] flex flex-col  px-3">
				<div className="flex flex-row justify-start mr-auto gap-1 items-center">
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
					{!sent ? (
						<main className="bg-white/10 backdrop-blur-md w-full sm:w-[400px] px-6 py-6 shadow-lg border border-white/20 rounded-md flex flex-col items-center">
							<h1
								className={`font-bold text-2xl mt-2 text-gray-200 ${nunito.className}`}>
								Forgot Password
							</h1>
							<p className={`text-white text-sm mt-1 ${poppins.className}`}>
								No worries, we&apos;ll send reset instructions to your email
							</p>

							<form className="w-full mt-4 space-y-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full h-10 rounded-3xl bg-white/80 text-gray-700 px-4 text-sm focus:outline-none"
								/>
							</form>

							<button
								onClick={sendResetEmail}
								className={`bg-white text-[#3a0657] h-10 rounded-3xl mt-5 w-full font-bold ${poppins.className}`}>
								Reset Password
							</button>

							<p
								className="text-white mt-5 flex items-center gap-1 underline cursor-pointer text-sm"
								onClick={() => router.push("/login")}>
								<FaArrowLeft className="text-sm mt-[4px]" /> Back to Log in
							</p>
						</main>
					) : (
						<main className="bg-white/10 backdrop-blur-md w-full sm:w-[400px] px-6 py-6 shadow-lg border border-white/20 rounded-md flex flex-col items-center">
							<MdEmail className="text-2xl text-white" />
							<h1
								className={`font-bold text-2xl mt-3 text-gray-200 ${nunito.className}`}>
								Reset Password
							</h1>

							<p
								className={`text-white text-center text-sm mt-1 ${poppins.className}`}>
								Enter the 6-digit code sent to{" "}
								 your email 
							</p>

							<form className="w-full mt-4 space-y-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full h-10 rounded-3xl bg-white/80 text-gray-700 px-4 text-sm focus:outline-none"
								/>
								<input
									type="tel"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									placeholder="Enter code"
									className="w-full h-10 rounded-3xl bg-white/80 text-gray-700 px-4 text-sm focus:outline-none"
								/>

								{/* 👁️ Password input with eye toggle */}
								<div className="w-full relative">
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										onFocus={() => setTouched(true)}
										placeholder="Enter new password"
										className="w-full h-10 rounded-3xl bg-white/80 text-gray-700 px-4 text-sm focus:outline-none"
									/>
									{touched && password.length > 0 && (
										<span
											className="absolute top-2/4 -translate-y-1/2 right-3 cursor-pointer"
											onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <FaEye /> : <FaEyeSlash />}
										</span>
									)}
								</div>
							</form>

							<button
								onClick={resetPassword}
								className={`bg-white text-[#3a0657] h-10 rounded-3xl mt-5 w-full font-bold ${poppins.className}`}>
								Continue
							</button>

							<p
								className={`text-white mt-5 text-sm ${poppins.className}`}
								onClick={sendResetEmail}>
								Didn&apos;’t receive the email?{" "}
								<span className="font-bold underline cursor-pointer">
									{" "}
									Click to Resend
								</span>
							</p>

							<p
								className="text-white mt-5 flex items-center gap-1 underline cursor-pointer text-sm"
								onClick={() => router.push("/login")}>
								<FaArrowLeft className="text-sm mt-[2px]" /> Back to Log in
							</p>
						</main>
					)}
				</div>
			</div>
		</>
	);
};

export default Page;
