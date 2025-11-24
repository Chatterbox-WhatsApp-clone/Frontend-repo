import React from "react";
import { IoFilterOutline } from "react-icons/io5";
import { IoMailUnreadOutline } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CiStar } from "react-icons/ci";

const FilterChats = ({
	showFilter,
	setShowFilter,
	setTouched,
	touched,
	setActiveTab,
	activeTab,
}) => {
	const pathname = usePathname();
	useEffect(() => {
		const handleClickOutside = (e) => {
			// Check if click is outside the dropdown and outside the icon
			const filterDropdown = document.querySelector(".filter-dropdown");
			const filterIcon = document.querySelector(".filter-icon");
			if (
				filterDropdown &&
				filterIcon &&
				!filterDropdown.contains(e.target) &&
				!filterIcon.contains(e.target)
			) {
				setShowFilter(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => document.removeEventListener("click", handleClickOutside);
	}, [setShowFilter]);

	return (
		<div className=" hidden md:block">
			<IoFilterOutline
				className="filter-icon text-xl cursor-pointer mr-1"
				onClick={() => setShowFilter((prev) => !prev)}
			/>

			<div
				className={`${
					showFilter ? "block" : "hidden"
				}  filter-dropdown absolute top-20 left-60 w-auto flex flex-col px-3 py-2 rounded-xl bg-gray-200 shadow-3xl z-[1000]`}>
				<p className="text-gray-600 font-bold text-sm mb-2">Filter Chats by</p>

				<button
					onClick={(e) => setActiveTab("Unread")}
					className={`flex items-center gap-3 text-gray-700 hover:text-black py-1 ${
						activeTab === "Unread" ? "bg-white w-full rounded-lg px-2" : "px-2"
					}`}>
					<IoMailUnreadOutline className="text-xl" />
					<span className="text-sm">Unread</span>
				</button>

				<button
					onClick={(e) => setActiveTab("Favourites")}
					className={`flex items-center text-gray-700 hover:text-black gap-3 py-1 ${
						activeTab === "Favourites"
							? " bg-white w-full rounded-lg px-2"
							: "px-2"
					}`}>
					<MdFavoriteBorder className="text-xl" />
					<span className="text-sm">Favourites</span>
				</button>

				<button
					onClick={(e) => setActiveTab("Starred")}
					className={`flex items-center text-gray-700 hover:text-black gap-3 py-1 ${
						activeTab === "Starred"
							? " bg-white w-full rounded-lg px-2"
							: "px-2"
					}`}>
					<CiStar className="text-[22px]" strokeWidth={0.4} />
					<span className="text-sm">Starred</span>
				</button>
			</div>
		</div>
	);
};

export default FilterChats;
