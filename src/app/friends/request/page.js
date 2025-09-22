import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import FriendsRequest from "./FriendsRequest";

const page = () => {
	return (
		<div className="bg-gray-100 h-screen w-full flex-col flex md:flex-row items-center justify-center px-1 sm:px-3">
			<div>
				<FaArrowLeft />
			</div>

			<FriendsRequest />
		</div>
	);
};

export default page;
