"use client";
import React, { useState } from "react";
import { useClickedStore } from "@/zustand";

const DashboardLayout = ({ children }) => {
	const { clicked } = useClickedStore();
	return (
		<div className="grid grid-cols-1 md:grid-cols-[250px_1fr] bg-gray-50 rounded-tl-2xl h-full">
			{/* Left column: navigable content */}
			<aside className="overflow-y-auto md:border-r md:border-gray-100 md:shadow-[3px_0_4px_-1px_rgba(0,0,0,0.1)] overflow-hidden">
				{children} {/* page.js content will appear here */}
			</aside>

			{/* Right column: static messages window */}
			<div
				className={`messages md:ml-2 md:grid-cols-2 md:block ${
					clicked ? "block" : "hidden"
				}
    			`}>
				<h1>Welcome to chatterbox</h1>
			</div>
		</div>
	);
};

export default DashboardLayout;
