"use client";
import React, { useState } from "react";
import EditPhone from "../components/EditPhone";
import { IoIosPhonePortrait } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { Nunito, Poppins } from "next/font/google";
import { GoPencil } from "react-icons/go";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const PhoneSection = ({data}) => {
	const [openEditPhone, setOpenEditPhone] = useState(false);
	return (
		<div className="mt-5 border-b border-gray-300 pb-5">
			<h1
				className={`${nunito.className} text-base font-semibold flex flex-row gap-2 items-center`}>
				<IoIosPhonePortrait className="text-2xl" /> Phone Number
			</h1>
			<p className={`text-gray-600 mt-3 text-[12px] ${poppins.className}`}>
				Phone
			</p>
			<p
				className={`text-[15px] truncate flex flex-row gap-5 w/full justify-start items-center cursor-pointer z-50 font-bold ${poppins.className}`}
				onClick={(e) => setOpenEditPhone(!openEditPhone)}>
				{data?.data?.phoneNumber} <GoPencil className="text-[#3a0657]" />
			</p>
			{openEditPhone && <EditPhone setOpenEditPhone={setOpenEditPhone} />}
			<p
				className={`mt-1 text-[#3a0657] flex flex-row gap-1 items-center font-bold text-[13px] ${poppins.className}`}>
				<CiCircleCheck className="text-base font-bold" strokeWidth={1} />{" "}
				Verified
			</p>
		</div>
	);
};

export default PhoneSection;
