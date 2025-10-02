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
const MyFriends = lazy(() => import('./MyFriends'))
import { FaUserFriends } from "react-icons/fa";

const page = () => {
    const router = useRouter()
	return (
		<div className="bg-gray-100 h-full md:h-screen w-full flex-col flex md:flex-row items-center justify-center px-1 sm:px-2">
			<div className="w-full h-full md:w-[250px] lg:w-[300px] md:border-r md:border-gray-300 md:shadow-[3px_0_4px_-1px_rgba(0,0,0,0.1)] shadow-gray-200 px-1 sm:px-2 py-2 sm:py-4">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-1 p-1 rounded bg-gray-300 hover:bg-gray-400">
					<FaArrowLeft className="text-xs text-[#3a0657]" />
					<span className={`text-xs ${poppins.className}`}> Back</span>
				</button>

				<h1 className={`text-xl font-bold mt-5 ${nunito.className}`}>
					All Friends
				</h1>
				<p
					className={`text-sm ${poppins.className}  pb-3 border-b border-gray-300`}>
					Great! You’ve made some friends. Keep growing your network and
					connecting with more people
				</p>

				<Suspense fallback={null}>
					<MyFriends />
				</Suspense>
			</div>

			{/* only when clicked should you apply messages  on small screens*/}
			<div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-3 ">
				<FaUserFriends className="hidden md:block" size={80} />
				<h1 className={`${nunito.className} text-lg sm:text-xl text-gray-800 font-bold text-center hidden md:block`}>
					Select people's names to preview their profile
				</h1>
			</div>
		</div>
	);
};

export default page;
