"use client";
import React from "react";
import FriendsNav from "./FriendsNav";
import AllFriends from "./AllFriends";

const page = () => {
	return (
		<div className="bg-gray-100 h-screen w-full flex-col flex md:flex-row items-center justify-start px-1 sm:px-3">
			<FriendsNav />
			<AllFriends />
		</div>
	);
};

export default page;
