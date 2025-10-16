// "use client"
import React from "react";
import Image from "next/image";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const Navbar = () => {
	return (
		<nav className="h-10 w-full bg-gray-200 flex flex-col px-4">
			<div className="flex flex-row gap-2 items-center mt-1">
				<Image
					src={"/assets/images/chatterbox-logo.png"}
					className="w-5 h-5 object-cover mt-1"
					width={100}
					height={100}
					alt="logo"
				/>
				<p
					className={`text-[13px] mt-[3px] right-0 text-[#3a0657] ${poppins.className}`}>
					Chatterbox
				</p>
			</div>
		</nav>
	);
};

export default Navbar;
