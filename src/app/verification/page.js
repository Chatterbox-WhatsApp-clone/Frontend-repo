"use client";
import React, { useState, useRef } from "react";
import { Nunito, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useAuthenticatedStore } from "@/zustand";
import { IoPhonePortraitOutline } from "react-icons/io5";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900", "1000"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

/**
 * OTP Input Component
 */
const VerificationCodeInput = ({ length = 6, onChange }) => {
	const [values, setValues] = useState(Array(length).fill(""));
	const inputsRef = useRef([]);

	const handleChange = (e, index) => {
		const { value } = e.target;

		if (/^[0-9]$/.test(value)) {
			const newValues = [...values];
			newValues[index] = value;
			setValues(newValues);
			onChange(newValues.join(""));

			if (index < length - 1) {
				inputsRef.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			e.preventDefault(); // prevent default behavior
			const newValues = [...values];

			if (values[index]) {
				// If current input has a value, just clear it
				newValues[index] = "";
			} else if (index > 0) {
				// If current is empty, clear previous and focus
				newValues[index - 1] = "";
				inputsRef.current[index - 1].focus();
			}

			setValues(newValues);
		}
	};

	return (
		<div className="flex gap-2 justify-center">
			{values.map((digit, index) => (
				<input
					key={index}
					type="text"
					maxLength={1}
					value={digit}
					onChange={(e) => handleChange(e, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					ref={(el) => (inputsRef.current[index] = el)}
					className="w-12 h-12 border border-gray-300 text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>
			))}
		</div>
	);
};

const Page = () => {
	const router = useRouter();
	const { token } = useAuthenticatedStore();

	const [success, setSuccess] = useState(true);
	const [code, setCode] = useState("");
	const [status, setStatus] = useState("");
	const [sent, setSent] = useState(false);

	const sendCode = process.env.NEXT_PUBLIC_SEND_PHONENUMBER_CODE_ENDPOINT;
	const verifyCode = process.env.NEXT_PUBLIC_VERIFY_PHONENUMBER_ENDPOINT;

	const checkForAllFields = () => {
		if (code.length !== 6) {
			setSuccess(false);
			setStatus("Code must be exactly 6 digits");
			setTimeout(() => setStatus(""), 5000);
			return false;
		}
		return true;
	};

	const sendVerificationCode = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(sendCode, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(data?.message || "Error sending verification code");
				setSuccess(false);
				setTimeout(() => setStatus(""), 5000);
			} else {
				setStatus(`Verification code sent to your email`);
				setSuccess(true);
				setSent(true);
				setTimeout(() => setStatus(""), 5000);
			}
		} catch (error) {
			setStatus("Something went wrong. Try again later.");
			setTimeout(() => setStatus(""), 5000);
			setSuccess(false);
		}
	};

	const verifyPhoneNumber = async (e) => {
		e.preventDefault();
		if (!checkForAllFields()) return;
		try {
			const res = await fetch(verifyCode, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ code: code }),
			});

			const data = await res.json();
			if (!res.ok) {
				setStatus(data.message);
				setSuccess(false);
				setTimeout(() => setStatus(""), 5000);
			} else {
				setStatus(data.message || "Phone number successfully verified");
				setSuccess(true);
				setTimeout(() => setStatus(""), 5000);
				setTimeout(() => router.push("/uploadImage"), 5000);
			}
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
					className={`fixed top-4 inset-x-0 mx-auto text-center text-white py-2 px-4 rounded-md w-fit z-50 ${success ? "bg-green-600" : "bg-red-600"
						}`}>
					{status}
				</div>
			)}

			<div className="h-screen w-full bg-gradient-to-b from-[#9b67b3] from-5% to-[#3a0657] flex flex-col relative">
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
				<div className="flex justify-center items-center relative h-[90%] w-full">
					{!sent ? (
						<main className="bg-white/10 backdrop-blur-md h-auto w-full sm:w-[450px] sm:px-10 flex flex-col justify-center items-center mx-auto mt-3 px-3 py-4 shadow-lg border border-white/20 rounded-md">
							<IoPhonePortraitOutline className="text-white text-6xl" />
							<p
								className={`text-2xl mt-7 font-bold text-white ${nunito.className}`}>
								Verify Phone Number
							</p>
							<button
								onClick={sendVerificationCode}
								className={`bg-white text-black h-10 rounded-3xl mt-5 w-full font-bold  ${poppins.className}`}>
								Click to verify phone number
							</button>
							<p
								className={`text-white mt-5 text-sm ${poppins.className}`}
								onClick={sendVerificationCode}>
								Didn’t receive the email?{" "}
								<span className="font-bold underline cursor-pointer">
									Click to Resend
								</span>
							</p>
							<p
								className="text-white mt-5 flex items-center gap-1 underline cursor-pointer text-sm"
								onClick={() => router.push("/signup")}>
								<FaArrowLeft className="text-sm mt-[4px]" /> Back to Signup page
							</p>
						</main>
					) : (
						<main className="bg-white/10 backdrop-blur-md h-auto w-full sm:w-[450px] sm:px-10 flex flex-col justify-center items-center mx-auto mt-3 px-3 py-4 shadow-lg border border-white/20 rounded-md">
							<h1
								className={`font-bold text-2xl mt-3 text-gray-200 ${nunito.className}`}>
								Verify Phone Number
							</h1>

							<p
								className={`text-white text-center text-sm mt-1 ${poppins.className}`}>
								Enter the 6-digit code sent to your email
							</p>

							<form className="w-full mt-4 space-y-3">
								<VerificationCodeInput length={6} onChange={setCode} />
							</form>

							<button
								onClick={verifyPhoneNumber}
								className={`bg-white text-[#3a0657] h-10 rounded-3xl mt-5 w-full font-bold ${poppins.className}`}>
								Verify
							</button>

							<p
								className="text-white mt-5 flex items-center gap-1 underline cursor-pointer text-sm"
								onClick={() => router.push("/signup")}>
								<FaArrowLeft className="text-sm mt-[2px]" /> Back to Signup
							</p>
						</main>
					)}
				</div>
			</div>
		</>
	);
};

export default Page;
