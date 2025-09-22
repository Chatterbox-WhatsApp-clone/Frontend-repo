
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

import { FaHome, FaUserPlus, FaUserFriends } from "react-icons/fa";
import { FaUserCheck, FaUserClock } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import FriendsNavigation from "./FriendsNavigation";

const FriendsNav = () => {
	const pathname = usePathname();
	// active route helper
	const isActive = (path) => pathname === path;

	const navItems = [
		{
			name: "Home",
			path: "/friends",
			icon: FaHome,
		},
		{
			name: "Friend Requests",
			path: "/friends/request",
			icon: FaUserPlus,
		},
		{
			name: "Online Friends",
			path: "/friends/online",
			icon: FaUserFriends,
		},
		{
			name: "All Friends",
			path: "/friends/all",
			icon: FaUserCheck,
		},
	];
	return (
		<nav className="w-full md:w-[230px] lg:w-[300px] md:h-full md:border-r md:border-gray-300 md:shadow-[3px_0_4px_-1px_rgba(0,0,0,0.1)] shadow-gray-200 px-1 sm:px-2 py-2">
			<h1 className={`text-2xl font-bold  ${nunito.className}`}>Friends</h1>
			<p className={`${poppins.className} text-wrap text-sm mt-1 font-light `}>
				Friendship made simple one tap to connect endless conversations ahead.
			</p>

			<FriendsNavigation />
			<nav className="hidden md:flex flex-row gap-3 md:flex-col w-full mt-5">
				{navItems.map((navLink) => (
					<Link
						key={navLink.path}
						href={navLink.path}
						className={`flex items-center justify-between gap-2 w-full px-2 py-2 rounded-md ${
							isActive(navLink.path) ? "bg-gray-200" : ""
						}`}>
						<div className="flex flex-row items-center gap-2">
							<navLink.icon
								className={`text-lg ${
									isActive(navLink.path) ? "text-[#52077a]" : "text-gray-600"
								}`}
							/>
							<span>{navLink.name}</span>
						</div>

						<IoIosArrowForward
							className={`text-lg ${
								navLink.name === "Home" ? "hidden" : "flex"
							}`}
						/>
					</Link>
				))}
			</nav>
		</nav>
	);
};

export default FriendsNav;
