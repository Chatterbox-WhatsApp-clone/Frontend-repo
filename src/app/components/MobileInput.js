import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";

const MobileInput = ({
	setShowMobileInput,
	input,
	setInput,
	touched,
	setTouched,
}) => {
	return (
		<div className="absolute top-0 left-0 right-0 w-full h-20 shadow-2xl bg-white px-4 md:hidden flex justify-center">
			<form className="w-full sm:w-[60%] relative flex justify-center items-center">
				{/* Input */}
				<input
					type="text"
					onClick={() => setTouched(true)}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Search or start a new chat"
					className="py-2 rounded-full text-sm px-12 border-b-3 border-b-[#8f45b7] focus:outline-none bg-gray-200 w-full"
				/>

				{/* Left icon */}
				<FaArrowLeft
					className="absolute left-4 text-gray-700 cursor-pointer"
					onClick={() => setShowMobileInput(false)}
				/>

				{/* Right icon (only shows if text exists) */}
				{input.length > 0 && (
					<LiaTimesSolid
						className="absolute right-4 text-gray-700 cursor-pointer"
						onClick={() => setInput("")}
					/>
				)}
			</form>
		</div>
	);
};

export default MobileInput;
