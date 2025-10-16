import React, { useState } from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
import { useAuthenticatedStore } from "@/zustand";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaUser } from "react-icons/fa";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const UserSearch = ({ onUserClick }) => {
	const { token } = useAuthenticatedStore();
	const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
	const [searchQuery, setSearchQuery] = useState("");

	// Fetch all users for search
	const fetchAllUsers = async () => {
		const res = await fetch(`${backendBase}/api/users`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) return [];
		return res.json();
	};

	const { data: usersData, isLoading } = useQuery({
		queryKey: ["all-users"],
		queryFn: fetchAllUsers,
		staleTime: 300000,
		cacheTime: 300000,
	});

	const formatLastSeen = (lastSeen) => {
		if (!lastSeen) return "last seen a long time ago";

		const now = new Date();
		const lastSeenDate = new Date(lastSeen);
		const diffInMs = now - lastSeenDate;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

		if (diffInMinutes < 1) return "last seen just now";
		if (diffInMinutes < 60)
			return `last seen ${diffInMinutes} minute${
				diffInMinutes > 1 ? "s" : ""
			} ago`;
		if (diffInHours < 24)
			return `last seen ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
		if (diffInDays < 30)
			return `last seen ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

		return "last seen a long time ago";
	};

	const allUsers = usersData?.data || [];

	// Filter users based on search query
	const filteredUsers = allUsers.filter(
		(user) =>
			user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="w-full">
			{/* Search Input */}
			<div className="relative mb-4">
				<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
				<input
					type="text"
					placeholder="Search users by name or email..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a0bb5] focus:border-transparent ${poppins.className}`}
				/>
			</div>

			{/* Search Results */}
			<div className="space-y-2 max-h-96 overflow-y-auto">
				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a0bb5]"></div>
					</div>
				) : searchQuery && filteredUsers.length === 0 ? (
					<div className="text-center py-8">
						<FaUser className="w-12 h-12 text-gray-300 mx-auto mb-2" />
						<p className={`text-gray-500 ${poppins.className}`}>
							No users found matching {searchQuery}
						</p>
					</div>
				) : searchQuery ? (
					filteredUsers.map((user) => {
						const profilePicture = user?.profilePicture
							? `${backendBase}${user.profilePicture}`
							: "/assets/images/userImage.jpg";

						return (
							<div
								key={user._id}
								onClick={() => onUserClick(user)}
								className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100">
								<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
									<Image
										className="w-full h-full object-cover"
										src={profilePicture}
										width={48}
										height={48}
										alt={`${user.username} profile`}
									/>
								</div>
								<div className="flex-1">
									<h5 className={`font-medium ${poppins.className}`}>
										{user.username}
									</h5>
									{user.email && (
										<p className={`text-sm text-gray-500 ${poppins.className}`}>
											{user.email}
										</p>
									)}
									<p className={`text-xs text-gray-400 ${poppins.className}`}>
										{formatLastSeen(user.lastSeen)}
									</p>
								</div>
								{user.isOnline && (
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								)}
							</div>
						);
					})
				) : (
					<div className="text-center py-8">
						<FaSearch className="w-12 h-12 text-gray-300 mx-auto mb-2" />
						<p className={`text-gray-500 ${poppins.className}`}>
							Start typing to search for users
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserSearch;
