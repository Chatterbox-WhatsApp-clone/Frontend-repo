"use client";
import React, { useState, lazy, Suspense } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { useRouter } from "next/navigation";
const OnlineFriends = lazy(() => import("./OnlineFriends"));
const UserProfile = lazy(() => import("../all/UserProfile"));

const Page = () => {
	const router = useRouter();
	return (
		<div className="bg-gray-100 h-full w-full flex-col flex md:flex-row items-start justify-start ps-1 sm:ps-2 overflow-hidden shrink-0 min-h-0">
			<div className="w-full h-full md:w-[280px] lg:w-[300px] md:border-r md:border-gray-300 md:shadow-[3px_0_4px_-1px_rgba(0,0,0,0.1)] shadow-gray-200 px-1 sm:px-1 py-2 sm:py-3 overflow-hidden min-h-0">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-1 p-1 rounded bg-gray-300 hover:bg-gray-400">
					<FaArrowLeft className="text-xs text-[#3a0657]" />
					<span className={`text-xs ${poppins.className}`}> Back</span>
				</button>

				<h1 className={`text-xl font-bold mt-3 ${nunito.className}`}>
					Online Friends
				</h1>
				<p
					className={`text-sm ${poppins.className}  pb-3 border-b border-gray-300 text-gray-800`}>
					Keep growing your network and connecting with more people
				</p>

				<Suspense fallback={null}>
					<OnlineFriends />
				</Suspense>
			</div>

			<Suspense fallback={null}>
				<UserProfile />
			</Suspense>
		</div>
	);
};

export default Page;
