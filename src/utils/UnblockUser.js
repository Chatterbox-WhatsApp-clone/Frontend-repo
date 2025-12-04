"use client";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import {
    useAuthenticatedStore,
    useUserProfile,
    useUpdateUserStore,
} from "@/zustand";
import Modal from "@/app/components/Modal";
import { useQueryClient } from "@tanstack/react-query";

const UnblockUser = ({ setUnblockModal }) => {
    const { activeUser, activeChat, isBlocked } = useUserProfile();
    const { setUserUpdated } = useUpdateUserStore();
    const { token } = useAuthenticatedStore();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState(false);
    const queryClient = useQueryClient()

    // Determine user ID: activeUser might be null if blocked, so check activeChat.user
    const userToUnblock = activeUser || activeChat?.user;
    const id = userToUnblock?._id;

    const unblockUser = async () => {
        setLoading(true);
        if (!id) return;

        // Use the env var as requested
        const endpoint = process.env.NEXT_PUBLIC_UNBLOCK_USER.replace("{id}", id);

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setSuccess(true);
                setStatus(`${userToUnblock?.username} has been unblocked`);

                // Close modal after delay
                setTimeout(() => setUnblockModal(false), 2000);

                // Trigger updates
              	queryClient.invalidateQueries({ queryKey: ["all_messages"] });
								queryClient.invalidateQueries({ queryKey: ["chat_messages"] });
                // Optionally update activeUser state if needed
            } else {
                console.error("Failed to unblock User");
                setSuccess(false);
                setStatus("Failed to unblock user");
            }
        } catch (err) {
            console.error("Error sending request:", err);
            setStatus("Error unblocking user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {status && (
                <div
                    className={`top-2 right-0 left-0 fixed inset-0 text-center text-white h-10 flex justify-center items-center w-full sm:w-[310px] z-50 text-base mx-auto ${!success ? "bg-red-600" : "bg-green-600 px-3 py-3 rounded-md"
                        }`}>
                    {status}
                </div>
            )}

            <Modal>
                <div className="flex flex-col items-center bg-white shadow-lg shadow-gray-400 p-6 rounded-xl max-w-sm w-[90%]">
                    <p className="text-gray-800 text-center mb-4 font-medium">
                        Are you sure you want to unblock{" "}
                        {userToUnblock?.username}? They will be able to send you messages again.
                    </p>
                    <div className="flex flex-row justify-between w-full gap-3">
                        <button
                            onClick={() => setUnblockModal(false)}
                            className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2 font-semibold hover:bg-gray-300">
                            Cancel
                        </button>
                        <button
                            onClick={unblockUser}
                            className="flex-1 bg-green-600 text-white rounded-md py-2 font-semibold hover:bg-green-700">
                            {loading ? <PulseLoader size={3} color="#ffffff" /> : "Unblock"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UnblockUser;
