import React, { useState } from "react";
import { Nunito, Poppins } from "next/font/google";
import Image from "next/image";
import { useAuthenticatedStore } from "@/zustand";
import { useQuery } from "@tanstack/react-query";
import { IoMdClose } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";

const nunito = Nunito({
subsets: ["latin"],
weight: ["400", "500", "700", "1000", "900"],
});

const poppins = Poppins({
subsets: ["latin"],
weight: ["400", "500", "700", "900"],
});

const UserProfileModal = ({ user, isOpen, onClose }) => {
const { token } = useAuthenticatedStore();
const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

// Fetch user's friends
const fetchUserFriends = async () => {
if (!user?._id) return [];
const res = await fetch(`${backendBase}/api/users/${user._id}/friends`, {
method: "GET",
headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) return [];
return res.json();
};

const { data: friendsData, isLoading: friendsLoading } = useQuery({
queryKey: ["user-friends", user?._id],
queryFn: fetchUserFriends,
enabled: !!user?._id && isOpen,
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
if (diffInMinutes < 60) return `last seen ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
if (diffInHours < 24) return `last seen ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
if (diffInDays < 30) return `last seen ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

return "last seen a long time ago";
};

if (!isOpen || !user) return null;

const profilePicture = user?.profilePicture
? `${backendBase}${user.profilePicture}`
: "/assets/images/userImage.jpg";

const friends = friendsData?.data || [];

return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
{/* Header */}
<div className="flex items-center justify-between p-4 border-b">
<h2 className={`text-xl font-bold ${nunito.className}`}>Profile</h2>
<button
onClick={onClose}
className="p-2 hover:bg-gray-100 rounded-full transition-colors"
>
<IoMdClose className="w-5 h-5" />
</button>
</div>

{/* Content */}
<div className="overflow-y-auto max-h-[calc(90vh-80px)]">
{/* User Info */}
<div className="p-6 border-b">
<div className="flex items-center space-x-4">
<div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#7a0bb5]">
<Image
className="w-full h-full object-cover"
src={profilePicture}
width={80}
height={80}
alt={`${user.username} profile`}
/>
</div>
<div className="flex-1">
<h3 className={`text-2xl font-bold ${nunito.className}`}>
{user.username}
</h3>
{user.email && (
<p className={`text-gray-600 ${poppins.className}`}>
{user.email}
</p>
)}
<div className="flex items-center mt-2">
<FaUserFriends className="w-4 h-4 text-[#7a0bb5] mr-2" />
<span className={`text-sm ${poppins.className}`}>
{friends.length} friend{friends.length !== 1 ? 's' : ''}
</span>
</div>
</div>
</div>
</div>

{/* Friends List */}
<div className="p-6">
<h4 className={`text-lg font-semibold mb-4 ${nunito.className}`}>
Friends ({friends.length})
</h4>

{friendsLoading ? (
<div className="flex justify-center py-8">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a0bb5]"></div>
</div>
) : friends.length === 0 ? (
<div className="text-center py-8">
<FaUserFriends className="w-12 h-12 text-gray-300 mx-auto mb-2" />
<p className={`text-gray-500 ${poppins.className}`}>
No friends yet
</p>
</div>
) : (
<div className="space-y-3">
{friends.map((friend) => {
const friendProfilePicture = friend?.profilePicture
? `${backendBase}${friend.profilePicture}`
: "/assets/images/userImage.jpg";

return (
<div
key={friend._id}
className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
>
<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
<Image
className="w-full h-full object-cover"
src={friendProfilePicture}
width={48}
height={48}
alt={`${friend.username} profile`}
/>
</div>
<div className="flex-1">
<h5 className={`font-medium ${poppins.className}`}>
{friend.username}
</h5>
<p className={`text-sm text-gray-500 ${poppins.className}`}>
{formatLastSeen(friend.lastSeen)}
</p>
</div>
{friend.isOnline && (
<div className="w-3 h-3 bg-green-500 rounded-full"></div>
)}
</div>
);
})}
</div>
)}
</div>
</div>
</div>
</div>
);
};

export default UserProfileModal;
