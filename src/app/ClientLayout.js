"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileNavbar from "./components/MobileNavbar";
import { useAuthenticatedStore } from "@/zustand";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchUser from "./FetchUser";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }) {
    const [queryClient] = useState(() => new QueryClient());
    const { authenticated } = useAuthenticatedStore();
    const [ready, setReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const redirect = async () => {
            if (authenticated) {
            } else {
            }
            setReady(true);
        };

        redirect();
        setReady(true);
    }, [authenticated, router]);

    return (
        <QueryClientProvider client={queryClient}>
            <FetchUser />
            {authenticated ? (
                <div className="flex flex-col h-screen">
                    {ready && (
                        <>
                            <Navbar />
                            <MobileNavbar />
                        </>
                    )}
                    <div className="flex h-full min-h-0">
                        <Sidebar />
                        <main className="flex-1 h-full">{children}</main>
                    </div>
                </div>
            ) : (
                <main className="h-screen">{children}</main>
            )}
        </QueryClientProvider>
    );
}
