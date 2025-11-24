import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
const ShowImages = ({ image, setShowImage, showImage }) => {
	const anyImage = image || "/assets/images/userImage.jpg";

	return (
		showImage && (
			<div className="fixed inset-0 z-[9999] bg-black/100 flex justify-center items-center px-3 py-3 w-full">
				<FaTimes
					className="absolute top-2 right-4 text-white text-2xl cursor-pointer"
					onClick={() => setShowImage(false)}
				/>

				{/* Image Container */}
				<div className="relative w-[90%] h-[90%] flex justify-center items-center">
					<Image
						src={anyImage}
						alt="Preview"
						fill
						className="object-cover rounded-md"
					/>
				</div>
			</div>
		)
	);
};

export default ShowImages;
