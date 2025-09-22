import React from "react";
import { FaHome, FaUserPlus } from "react-icons/fa";
import { FaUserCheck, FaUserClock } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

const FriendsNavigation = () => {
	const pathname = usePathname();
	const isActive = (path) => pathname === path;
	const navItems = [
		{
			name: "Friend Requests",
			path: "/friends/request",
		},
		{
			name: "Online Friends",
			path: "/friends/online",
		},
		{
			name: "All Friends",
			path: "/friends/all",
		},
	];
	return (
		<div className="flex flex-row items-center justify-center gap-1 md:hidden mt-3">
			{navItems.map((navLink) => (
				<Link
					key={navLink.path}
					href={navLink.path}
					className={`flex text-sm font-medium items-center justify-center rounded-full  w-full py-1 ${
						(poppins.className,
						isActive(navLink.path) ? "bg-gray-400" : "bg-gray-300")
					}`}>
					<span>{navLink.name}</span>
				</Link>
			))}
		</div>
	);
};

export default FriendsNavigation;
