"use client";
import React, { useEffect, useState } from "react";
import { useAuthenticatedStore } from "@/zustand";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Chats from "./chats/page";

export default function Home() {
	const { authenticated } = useAuthenticatedStore();
	const router = useRouter();
	const [ready, setReady] = useState(false);

	// once redirect finishes, render nothing

	useEffect(() => {
		const redirect = async () => {
			if (authenticated) {
			} else {
				await router.replace("/welcome");
			}
			setReady(true);
		};

		redirect();
		setReady(true);
	}, [authenticated, router]);

	if (!ready) {
		return (
			<div className="flex justify-center items-center flex-col gap-5 mx-auto bg-white w-full h-full">
				<Image
					src={"/assets/images/chatterbox-logo.png"}
					alt="Logo"
					width={100}
					height={100}
					className="h-10 w-10 object-cover"
				/>
				<div className="loader"></div>
			</div>
		);
	}

	return authenticated ? <Chats /> : null;
}
