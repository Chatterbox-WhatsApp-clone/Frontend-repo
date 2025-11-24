"use client";
import React, { lazy, Suspense } from "react";
const TopOfChats = lazy(() => import("./TopOfChats"));
const BottomOfChats = lazy(() => import("./ChatsBottom"));
const ChatsDetails = lazy(() => import("./ChatDetails"))

const ChatBackground = ({ setOpenChats }) => {
	return (
		<>
			<div
				className="w-full min-h-screen z-50 bg-gray-200 messages top-0 fixed inset-0 translate-x-0 transition-transform ease-in-out md:hidden overflow-y-auto"
				style={{
					backgroundImage: `url(/assets/images/chatBackground.jpg)`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}>
				<Suspense fallback={null}>
					<TopOfChats setOpenChats={setOpenChats} />
				</Suspense>
				<Suspense fallback={null}>
					<ChatsDetails />
				</Suspense>
				<Suspense fallback={null}>
					<BottomOfChats />
				</Suspense>
			</div>
			<div
				className="hidden fixed inset-0 md:flex justify-center items-center bg-black/40 z-50"
				>
				<div
					className="relative w-[55%] h-[65%] z-50 rounded-lg shadow-lg overflow-y-auto bg-gray-300"
					style={{
						backgroundImage: `url(/assets/images/chatBackground.jpg)`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}>
					<Suspense fallback={null}>
						<TopOfChats setOpenChats={setOpenChats} />
					</Suspense>
					<Suspense fallback={null}>
						<ChatsDetails />
					</Suspense>
					<Suspense fallback={null}>
						<BottomOfChats />
					</Suspense>
				</div>
			</div>
		</>
	);
};

export default ChatBackground;
