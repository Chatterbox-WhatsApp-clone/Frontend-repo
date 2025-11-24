"use client";
import React, { useState } from "react";
import EditImage from "../components/EditImage";
import Image from "next/image";
import { GoPencil } from "react-icons/go";

const ImageSettingsSection = ({ profilePicture }) => {
	const [openEditImage, setOpenEditImage] = useState(false);
	return (
		<>
			<div className="flex flex-row justify-start items-center space-x-5 md:hidden">
				<div
					className="min-w-[100px] min-h-[100px] group border-2 rounded-full border-[#3a0657] relative overflow-hidden"
					onClick={() => setOpenEditImage(true)}>
					<Image
						src={profilePicture}
						alt="User image"
						fill
						className="object-cover rounded-full relative"
						sizes="100px"
					/>
				</div>
				{/* Edit Image Modal */}
				{openEditImage && (
					<EditImage
						profilePicture={profilePicture}
						setOpenEditImage={setOpenEditImage}
					/>
				)}
			</div>

			<div className="hidden md:flex flex-row space-x-5">
				<div className="w-[100px] h-[100px] relative group border-2 border-[#3a0657] rounded-full">
					<Image
						src={profilePicture}
						alt="User image"
						fill
						className="object-cover rounded-full"
						sizes="80px"
					/>
					<div
						className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<GoPencil
							className="text-white text-xl cursor-pointer"
							onClick={() => setOpenEditImage(true)}
						/>
					</div>
				</div>
				{openEditImage && (
					<EditImage
						profilePicture={profilePicture}
						setOpenEditImage={setOpenEditImage}
					/>
				)}
			</div>
		</>
	);
};

export default ImageSettingsSection;
