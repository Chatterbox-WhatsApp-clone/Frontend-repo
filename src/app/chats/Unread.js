import React from "react";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
const Unread = () => {
	const [clicked, setClicked] = useState(true);
	return (
		<>
			{clicked && (
				<div className="w-full md:ml-[48px] md:w-[250px] h-full md:h-dvh overflow-y-auto  md:top-[38px] md:absolute left-0 bg-red-500 px-4 z-50">
					<FaArrowLeft onClick={(e) => setClicked(false)} />
				</div>
			)}
		</>
	);
};

export default Unread;
