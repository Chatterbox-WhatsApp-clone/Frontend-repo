"use client";
import React, { useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { Nunito, Poppins } from "next/font/google";
import { GoPencil } from "react-icons/go";
import EditBio from "./EditBio";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const AccountSection = ({ data }) => {
	const [openEditBio, setOpenEditBio] = useState(false);
	return (
		<div className="mt-6 border-b border-gray-300 pb-5">
			<h1
				className={`${nunito.className} text-lg font-semibold flex flex-row gap-3 items-center`}>
				<IoKeyOutline /> Account
			</h1>

			<div className="flex flex-row gap-5 w-full justify-start items-center mt-4">
				<p className={`truncate text-[15px] font-bold ${poppins.className} `}>
					Bio : {""}
				</p>

				<p
					className={`truncate text-[14px] text-[#3a0657] ${poppins.className} `}
					onClick={() => setOpenEditBio(!openEditBio)}>
					Add
					<GoPencil className=" cursor-pointer z-50 inline-flex ml-2 -mt-1 text-[#3a0657]" />
				</p>
			</div>
			<p
				className={`truncate text-wrap text-[14px] mt-[2px] ${poppins.className} `}>
				{data?.data?.bio}
			</p>

			{openEditBio && <EditBio setOpenEditBio={setOpenEditBio} />}
			<p className={`text-gray-600 text-[12px] ${poppins.className} mt-4`}>
				Last seen and Online
			</p>
			<p className={`truncate text-[15px] mt-[2px] ${poppins.className}`}>
				Everyone
			</p>
			<p className={`text-gray-600 mt-4 text-[12px] ${poppins.className}`}>
				Profile Photo
			</p>
			<p className={`text-[15px] truncate ${poppins.className}`}>Everyone</p>

			<p className={`${poppins.className} text-sm truncate mt-4`}>
				Total Friends: {data?.data?.totalContacts}
			</p>
		</div>
	);
};

export default AccountSection;
