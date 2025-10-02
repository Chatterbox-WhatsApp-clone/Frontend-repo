"use client";
import React, { useState, lazy, Suspense } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Nunito, Poppins } from "next/font/google";
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
const FriendsRequest = lazy(() => import("./FriendsRequest"));
const SentRequest = lazy(() => import("./SentRequest"));
import { useRouter } from "next/navigation";

const page = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const onOpen = () => setIsOpen(true);
	const onClose = () => setIsOpen(false);

	const modalOnOpen = () => setModalIsOpen(true);
	const modalOnClose = () => setModalIsOpen(false);

	const handleSwitchModal = () => {
		onClose(); // close current modal
		modalOnOpen();
	};

	return (
		<>
			<div className="bg-gray-100 h-full md:h-screen w-full flex-col flex md:flex-row items-center justify-center px-1 sm:px-2">
				<div className="w-full h-auto md:h-full md:w-[230px] lg:w-[300px] md:border-r md:border-gray-300 md:shadow-[3px_0_4px_-1px_rgba(0,0,0,0.1)] shadow-gray-200 px-1 sm:px-2 py-2 sm:py-4">
					<div className="flex flex-row justify-between ">
						<button
							onClick={() => router.back()}
							className="flex items-center gap-1 p-1 rounded bg-gray-300 hover:bg-gray-400">
							<FaArrowLeft className="text-xs text-[#3a0657]" />
							<span className={`text-xs ${poppins.className}`}> Back</span>
						</button>

						<div className="block md:hidden bg-gray-300 h-7 w-7 rounded-full flex justify-center items-center">
							<BiDotsVerticalRounded
								className=" text-gray-800 text-xl"
								onClick={onOpen}
							/>
						</div>
					</div>

					<h1 className={`text-xl font-bold mt-5 ${nunito.className}`}>
						Friend Requests
					</h1>
					<p
						className={`text-sm ${poppins.className}  pb-3 border-b border-gray-300`}>
						Incoming friend requests
					</p>

					{isOpen && (
						<div className="fixed inset-0 bg-black/70 z-[90]" onClick={onClose}>
							<div className="fixed bottom-0 h-36 w-full bg-gray-100 rounded-t-2xl z-[99] shadow-lg  transform transition-transform duration-300 ease-in-out px-3 py-3">
								<div className="block ml-auto bg-gray-300 h-6 w-6 rounded-full flex justify-center items-center">
									<FaTimes
										className=" text-gray-800 text-lg"
										onClick={onClose}
									/>
								</div>
								<div className="flex justify-center items-center flex-col mt-2 gap-2">
									<p className={`text-base font-medium   ${poppins.className}`}>
										Outgoing friend requests
									</p>

									<button
										onClick={handleSwitchModal}
										className=" text-white text-sm bg-[#3a0657] py-2 rounded-md px-3">
										View sent requests
									</button>
								</div>
							</div>
						</div>
					)}

					<p className={`text-sm mt-3 hidden md:flex ${poppins.className}`}>
						Outgoing friend requests
					</p>

					<button
						className="text-sent hidden md:flex text-white text-sm mt-1 bg-[#3a0657] py-1 rounded-md px-3 cursor-pointer"
						onClick={modalOnOpen}>
						View sent requests
					</button>
				</div>

				<Suspense fallback={null}>
					<FriendsRequest />
				</Suspense>
			</div>

			{modalIsOpen && (
				<Suspense fallback={null}>
					<SentRequest modalOnClose={modalOnClose} />
				</Suspense>
			)}
		</>
	);
};

export default page;
