"use client";
import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import { VscLock } from "react-icons/vsc";
import { VscUnlock } from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClickedStore } from "@/zustand";
import { Nunito, Poppins } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useAuthenticatedStore, useUserData } from "@/zustand";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
const DesktopSetting = lazy(() => import("../setting/DesktopSetting"));

const BottomSidebar = () => {
	const pathname = usePathname();
	const { clicked, setClicked } = useClickedStore();
	const [locked, setLocked] = useState(true);
	const settingRef = useRef(null);

	const { token } = useAuthenticatedStore();
	const userEndpoint = process.env.NEXT_PUBLIC_GET_USER_ENDPOINT;
	const [showDesktopSetting, setShowDesktopSetting] = useState(false);

	const fetchUserInfo = async () => {
		try {
			const res = await fetch(userEndpoint, {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			});
			return res.json();
		} catch (error) {
			console.log(error, "Error fetching user data");
		}
	};

	const { data } = useQuery({
		queryKey: ["full-user-data"],
		queryFn: fetchUserInfo,
		staleTime: 300000,
		cacheTime: 300000,
	});

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const profilePicture = data?.data?.profilePicture
		? `${backendBase}${data.data.profilePicture}`
		: "/assets/images/userImage.jpg";

	// set Data to become the user in zustand
	const { setUserId } = useAuthenticatedStore();
	const { setUser } = useUserData();
	useEffect(() => {
		setUser(data);
		setUserId(data?.data?._id);
	}, [data, setUserId, setUser]);
	// set Data to the User's

	return (
		<>
			<div className="flex flex-col justify-start items-start w-full h-fit">
				<div className="flex flex-col justify-start items-start space-y-7 w-full border-b border-gray-200">
					<div
						className="ml-1 flex justify-start items-center cursor-pointer"
						onClick={(e) => setShowDesktopSetting(true)}>
						<div className="h-7 w-7 rounded-full object-cover">
							<Image
								className="h-full w-full rounded-full object-cover"
								width={100}
								height={100}
								alt="user image"
								src={profilePicture}
							/>
						</div>

						<span
							className={`text-sm ml-[6px] ${poppins.className} ${
								clicked ? "flex" : "hidden"
							} `}>
							Profile
						</span>
					</div>
				</div>
			</div>

			{showDesktopSetting && (
				<Suspense fallback={null}>
					<DesktopSetting
						ref={settingRef}
						setShowDesktopSetting={setShowDesktopSetting}
					/>
				</Suspense>
			)}
		</>
	);
};

export default BottomSidebar;
