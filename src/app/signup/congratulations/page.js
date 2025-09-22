"use client";
import React, { useEffect } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { useRouter } from "next/navigation";
import { useAuthenticatedStore } from "@/zustand";
import { useQuery } from "@tanstack/react-query";
const page = () => {
	const { setAuthenticated } = useAuthenticatedStore();
	const router = useRouter();
	function toHome() {
		setAuthenticated(true);
		router.push("/");
	}

	return (
		<div className="w-full sm:w-80 h-screen flex flex-col justify-center items-center gap-5 mx-auto px-3">
			<IoIosCheckmarkCircleOutline className="text-green-600 text-7xl tetx-wrap" />
			<p className={`text-center ${poppins.className}`}>
				🎉 Welcome aboard! Your account has been created successfully, and
				you’re all set to start chatting. Connect with friends, share moments,
				and stay close no matter the distance. We’re glad to have you here!
			</p>
			<button
				onClick={toHome}
				className={`bg-green-600 px-20 py-2 rounded-full text-center text-white ${poppins.className}`}>
				Continue
			</button>
		</div>
	);
};

export default page;
