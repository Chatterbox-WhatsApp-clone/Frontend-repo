"use client";
import React, { lazy, Suspense } from "react";
import FriendsNav from "./FriendsNav";
const AllFriends = lazy(() => import("./AllFriends"));
const Page = () => {
	return (
		<div className="bg-gray-50 h-full w-full flex-col flex md:flex-row items-center justify-start ">
			<FriendsNav />
			<Suspense fallback={null}>
				<AllFriends />
			</Suspense>
		</div>
	);
};

export default Page;
