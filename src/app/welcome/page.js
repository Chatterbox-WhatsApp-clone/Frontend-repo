"use client";
import React from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
import { useRouter } from "next/navigation";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { useAuthenticatedStore } from "@/zustand";

export default function Home() {
	const { authenticated } = useAuthenticatedStore();
	// function to signuppage
	const router = useRouter();
	function toSignUpPage() {
		router.push("/signup");
	}
	// function to signuppage

	return (
		<>
			{!authenticated && (
				<div className="min-h-screen h-screen w-full flex flex-col items-center justify-center">
					<Image
						src={"/assets/images/backgroundImage.jpg"}
						className="w-full sm:w-80 h-96 sm:h-[400px] z-50 object-cover mx-auto rounded absolute "
						width={200}
						height={200}
						alt="backgound Image"
					/>
					<main
						className={`relative inset-0 opacity-[93%] z-50 h-full w-full bg-gradient-to-b from-[#9b67b3] from-5% to-[#3a0657] to-95% flex flex-col mx-auto justify-center items-center space-y-9 pt-3 ${nunito.className}`}>
						<Image
							src={"/assets/images/chatterbox-logo.png"}
							className="w-24 h-24 object-cover rounded-full"
							width={200}
							height={200}
							alt="Logo"
						/>
						<h1 className={`text-white text-xl text-center`}>
							Welcome to <br />{" "}
							<span className="font-extrabold text-4xl">ChatterBox</span> <br />
							<span
								className={`mt-2 text-sm font-semibold ${poppins.className}`}>
								Talk, laugh, and connect more because <br /> every chat tells a
								story
							</span>{" "}
						</h1>

						<div className="space-y-2 mt-3">
							<p className="text-center text-sm text-gray-300">
								Tap Agree & Continue <br /> to accept the Terms of Service
							</p>
							<button
								className="bg-white text-center mt-3 w-54 h-9 rounded-3xl text-[#3a0657] cursor-pointer font-extrabold"
								onClick={toSignUpPage}>
								Agree & Continue
							</button>
						</div>
					</main>
					<p className="text-center text-sm float-end text-gray-200 font-bold absolute bottom-1 z-50">
						{" "}
						From Velora
					</p>
				</div>
			)}
		</>
	);
}
