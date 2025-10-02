"use client";
import React, { lazy, Suspense } from "react";
import FriendsNav from "./FriendsNav";
const AllFriends = lazy(() => import("./AllFriends"));
const page = () => {
	return (
		<div className="bg-gray-100 h-screen w-full flex-col flex md:flex-row items-center justify-start px-1 sm:px-3">
			<FriendsNav />
			<Suspense fallback={null}>
				<AllFriends />
			</Suspense>
		</div>
	);
};

export default page;
