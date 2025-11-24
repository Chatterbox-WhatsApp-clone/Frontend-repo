"use client";
import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { GoSearch } from "react-icons/go";

const SearchEngine = ({ input, setInput }) => {
	const [clicked, setClicked] = useState(false);
	return (
		<>
			<div className="top-10 fixed right-2 ml-auto  md:hidden">
				{clicked ? (
					<form
						className={` ${
							clicked ? "w-56 md:w-64" : "w-4"
						} flex justify-center items-center row relative gap-2`}>
						<input
							type="text"
							placeholder="Search friends"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className={`input ${
								clicked ? "py-[6px]" : "py-[1px]"
							} rounded-full border text-sm px-4 text-center w-full border-b-3 border-b-[#8f45b7] focus:outline-none`}
							onClick={() => setClicked(true)}
						/>
						<GoSearch className="text-black text-base absolute left-0 top-0 translate-y-1/2 ml-2 mt-[2px] z-50 " />
						
							<LiaTimesSolid
								className="text-black text-base absolute right-0 mr-2 top-0 translate-y-1/2 mt-[2px] cursor-pointer z-50"
								onClick={(e) => {
									setInput("");
									setClicked(false);
								}}
							/>
						
					</form>
				) : (
					<form
						className="border-2 rounded-full bg-gray-100 border-gray-200 py-1 px-1 mr-1 flex md:hidden"
						onClick={() => setClicked(true)}>
						<GoSearch className="text-black text-base cursor-pointer" />
					</form>
				)}
			</div>
			<div className="top-9 hidden md:block fixed right-0 mt-1 ml-auto">
				<form
					className={`md:w-64 
					flex justify-center items-center row relative gap-2`}>
					<input
						type="text"
						placeholder="Search friends"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className={`input 
							py-[6px]
						rounded-full border text-sm px-4 text-center w-full border-b-3 border-b-[#8f45b7] focus:outline-none`}
						onClick={() => setClicked(true)}
					/>
					<GoSearch className="text-black text-base absolute left-0 top-0 translate-y-1/2 ml-2 mt-[2px] z-50 " />
					{input?.length > 0 && (
						<LiaTimesSolid
							className="text-black text-base absolute right-0 mr-2 top-0 translate-y-1/2 mt-[2px] cursor-pointer z-50"
							onClick={(e) => {
								setInput("");
								setClicked(false);
							}}
						/>
					)}
				</form>
			</div>
		</>
	);
};

export default SearchEngine;
