"use client";
import React, { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { Nunito, Poppins } from "next/font/google";
import { GoPencil } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

import EditEmail from "../components/EditEmail";

const EmailSection = ({ data }) => {
	const [openEditEmail, setOpenEditEmail] = useState(false);
	return (
		<div className="mt-5 border-b border-gray-300 pb-5">
			<h1
				className={`${nunito.className} text-base font-semibold flex flex-row gap-3 items-center`}>
				<MdOutlineEmail className="text-xl" /> Email
			</h1>
			<p className={`text-gray-800 text-[14px] mt-1 ${poppins.className}`}>
				Email helps you access your account. It isn&apos;t visible to others.
			</p>
			<p className={`text-gray-600 mt-3 text-[12px] ${poppins.className}`}>
				Email
			</p>
			<p
				className={`text-[15px] truncate flex flex-row gap-5 w-full justify-start items-center cursor-pointer z-50 font-bold ${poppins.className}`}
				onClick={(e) => setOpenEditEmail(!openEditEmail)}>
				{data?.data?.email} <GoPencil className="text-[#3a0657]" />
			</p>
			{openEditEmail && <EditEmail setOpenEditEmail={setOpenEditEmail} />}
			<p
				className={`mt-1 text-[#3a0657] flex flex-row gap-1 items-center font-bold text-[13px] ${poppins.className}`}>
				<CiCircleCheck className="text-base font-bold" strokeWidth={1} />{" "}
				Verified
			</p>
		</div>
	);
};

export default EmailSection;
