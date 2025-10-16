import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const Favourites = () => {
	const [clicked, setClicked] = useState(true);
	return (
		<div className="w-full md:ml-[48px] md:w-[248px] h-full md:h-dvh overflow-y-auto z-[10] md:top-[38px] md:absolute left-0 bg-red-500 px-4">
			<FaArrowLeft onClick={(e) => setClicked(false)} />
			Hello world
		</div>
	);
};

export default Favourites;
