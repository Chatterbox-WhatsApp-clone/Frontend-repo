"use client";
import React from "react";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { useState, useEffect } from "react";
import { GoSearch } from "react-icons/go";
import { LiaTimesSolid } from "react-icons/lia";
import FilterChats from "../components/FilterChats";
import MobileInput from "@/app/components/MobileInput";
import { useClickedStore } from "@/zustand";
import Unread from "./Unread";
import Favourites from "./Favourites";
import Starred from "./Starred";
import AllChats from "./AllChats";
import PageWrapper from "./PageWrapper";
import Messages from "./Messages";

const Page = () => {
	const { setClicked } = useClickedStore();
	const [input, setInput] = useState("");
	const [touched, setTouched] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [showMobileInput, setShowMobileInput] = useState(false);
	const handleFileRef = () => {
		setShowMobileInput(true);
	};

	// function to set touched to false by clicking on any place in the document's body
	useEffect(() => {
		function closeTouchedOnOutsideClick(e) {
			if (!e.target.closest(".input")) {
				setTouched(false);
			}
		}
		document.addEventListener("click", closeTouchedOnOutsideClick);

		return () => {
			document.removeEventListener("click", closeTouchedOnOutsideClick);
		};
	}, []);

	// for chat navigations
	const [activeTab, setActiveTab] = useState("All");
	const chatTabs = ["All", "Unread", "Favorites", "Starred"];
	const renderChats = () => {
		switch (activeTab) {
			case "Unread":
				return <Unread />;
			case "Favorites":
				return <Favourites />;
			case "Starred":
				return <Starred />;
			default:
				return <AllChats />;
		}
	};

	return (
		<>
			<div className="w-full h-full grid grid-cols-1 md:grid-cols-[280px_1fr] bg-gray-50 rounded-tl-2xl  px-2 ">
				<PageWrapper>
					{/* top of the chats page */}
					<div className="w-full h-10 md:h-20 md:pt-2">
						<div className="flex flex-row justify-between items-center">
							<h1
								onClick={(e) => setClicked(true)}
								className={`font-bold text-2xl  ${nunito.className}`}>
								Chats
							</h1>

							<div className="flex flex-row gap-x-3">
								<form className="border-2 rounded-full bg-gray-100 border-gray-200 py-1 px-1 md:hidden">
									<GoSearch
										className="text-black text-base cursor-pointer"
										onClick={handleFileRef}
									/>
								</form>
								<FilterChats
									showFilter={showFilter}
									setShowFilter={setShowFilter}
									setTouched={setTouched}
									touched={touched}
									setActiveTab={setActiveTab}
									activeTab={activeTab}
								/>
							</div>
						</div>

						{/* for searchings chats */}
						<form className="w-[95%] mt-2 hidden md:flex justify-center items-center row relative gap-2 ">
							<input
								type="text"
								placeholder="Search or start a new chat"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								className={`input py-1 rounded-md border text-sm px-4 text-center w-full border-b-3 border-b-[#8f45b7] focus:outline-none`}
								onClick={(e) => setTouched(true)}
							/>
							<GoSearch className="text-black text-[13px] absolute left-0 top-0 translate-y-1/2 ml-2 mt-[2px] z-50 md:hidden" />
							{input.length > 0 && (
								<LiaTimesSolid
									className="text-black text-[13px] absolute right-0 mr-2 top-0 translate-y-1/2 mt-[2px] cursor-pointer z-50"
									onClick={(e) => setInput("")}
								/>
							)}
						</form>

						{/* for searchings chats */}
					</div>

					{/* for chats naviagation*/}
					<div className="w-full h-7 overflow-x-auto scroll-smooth md:hidden">
						<div className="w-full flex flex-row justify-center items-center gap-5 ">
							{chatTabs.map((chatTab) => (
								<button
									onClick={(e) => setActiveTab(chatTab)}
									className={`h-6 w-full flex justify-center items-center rounded-full px-2 ${
										activeTab === chatTab
											? "bg-[#c2b6ca] border border-gray-400"
											: "border border-gray-400"
									}`}
									key={chatTab}>
									<span className={`text-[12px] ${poppins.className}`}>
										{chatTab}
									</span>
								</button>
							))}
						</div>
					</div>
					{/* for chats naviagation*/}

					{/* rendering components */}
					<div className="mt-3 w-full px-1">{renderChats()}</div>
					{/* rendering components */}
				</PageWrapper>
				<Messages />
			</div>

			{showMobileInput && (
				<MobileInput
					setShowMobileInput={setShowMobileInput}
					input={input}
					setInput={setInput}
					setTouched={setTouched}
					touched={touched}
				/>
			)}
		</>
	);
};

export default Page;
