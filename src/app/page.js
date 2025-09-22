"use client";
import React, { useEffect, useState } from "react";
import { useAuthenticatedStore } from "@/zustand";
import { useRouter } from "next/navigation";
import Spinner from "@/Spinner";

export default function Home() {
	const { authenticated } = useAuthenticatedStore();
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// only run redirect once when auth state is known
		if (authenticated === undefined) return; // prevent running before Zustand hydrates

		const redirect = async () => {
			if (authenticated) {
				await router.replace("/dashboard/chats");
			} else {
				await router.replace("/welcome");
			}
			setReady(true);
		};

		redirect();
	}, [authenticated, router]);

	// while waiting, show spinner
	if (!ready) {
		return <Spinner />;
	}

	// once redirect finishes, render nothing
	return null;
}
