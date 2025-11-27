import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { IoMdSend, IoMdImage, IoMdClose, IoMdCheckmark, IoMdVideocam } from "react-icons/io";
import { Nunito } from "next/font/google";
import {
	useAuthenticatedStore,
	useUserProfile,
	useMessagesStore,
} from "@/zustand";
import { socket } from "@/socket";
import { generateChatId } from "@/utils/GenerateChatId";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

const ChatsBottom = () => {
	const [input, setInput] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [fileType, setFileType] = useState(null); // 'image' or 'video'
	const [uploading, setUploading] = useState(false);

	const { userId, token } = useAuthenticatedStore();
	const { activeUser, isEditing, setIsEditing, activeMessage, setActiveMessage } = useUserProfile();

	// authenticate once when user/token available
	useEffect(() => {
		if (!userId || !token) return;
		socket.emit("authenticate", { userId, token });
	}, [userId, token]);

	// Populate input when editing
	useEffect(() => {
		if (isEditing && activeMessage) {
			setInput(activeMessage.content || activeMessage.message || "");
		}
	}, [isEditing, activeMessage]);

	// Use chatId from activeUser if available, otherwise generate one
	const chatId = activeUser?.chatId || generateChatId(userId, activeUser?._id);

	// send message function
	const handleFileSelect = (e, type) => {
		const file = e.target.files[0];
		if (!file) return;

		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setSelectedFile(file);
		setFileType(type);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const clearFile = () => {
		setSelectedFile(null);
		setFileType(null);
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(null);
		const imgInput = document.getElementById("imageInput");
		const vidInput = document.getElementById("videoInput");
		if (imgInput) imgInput.value = "";
		if (vidInput) vidInput.value = "";
	};

	// send message function
	const handleSend = async () => {
		if ((!input.trim() && !selectedFile) || !userId || !activeUser?._id) return;

		// 1. Handle Media Upload (Always HTTP)
		if (selectedFile) {
			setUploading(true);
			try {
				const formData = new FormData();
				formData.append(fileType, selectedFile);

				let endpoint = fileType === 'image'
					? process.env.NEXT_PUBLIC_UPLOAD_IMAGE
					: process.env.NEXT_PUBLIC_UPLOAD_VIDEO;

				endpoint = endpoint.replace("{chatId}", chatId);

				const res = await fetch(endpoint, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});

				if (!res.ok) throw new Error("Upload failed");

				clearFile();
			} catch (err) {
				console.error("Media upload error", err);
			} finally {
				setUploading(false);
			}
		}

		// 2. Handle Text Message
		if (input.trim()) {
			const isActive = activeUser?.isActive;

			if (isActive) {
				socket.emit("send_message", {
					chatId,
					content: input,
					type: "text",
					receiverId: activeUser?._id,
				});
			} else {
				try {
					const endpoint = process.env.NEXT_PUBLIC_POST_MESSAGES.replace("{chatId}", chatId);
					await fetch(endpoint, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							type: "text",
							content: { text: input }
						}),
					});
				} catch (err) {
					console.error("Text send error", err);
				}
			}
			setInput("");
			socket.emit("typing_stop", { chatId });
		}
	};

	const handleEditSubmit = async () => {
		if (!input.trim() || !activeMessage?._id) return;

		try {
			const res = await fetch(
				process.env.NEXT_PUBLIC_EDIT_MESSAGE.replace("{messageId}", activeMessage._id),
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ content: input }),
				}
			);

			if (!res.ok) throw new Error("Failed");

			// Reset state
			setIsEditing(false);
			setInput("");
			setActiveMessage(null);

			// Optionally refresh messages or rely on socket/query invalidation
		} catch (err) {
			console.error("Failed to update message", err);
		}
	};

	return (
		<div className="fixed bottom-[1px] md:bottom-0 w-full flex flex-row items-end justify-center pb-1 md:pb-0 md:pt-0 bg-transparent bg-opacity-70 backdrop-blur-md md:bg-white pt-1">
			{/* Preview Area */}
			{previewUrl && (
				<div className="absolute bottom-14 left-0 w-full bg-white p-2 border-t border-gray-200 flex flex-col gap-2 z-10">
					<div className="relative w-fit">
						{fileType === 'image' ? (
							<img src={previewUrl} alt="Preview" className="h-32 w-auto rounded-md object-cover" />
						) : (
							<video src={previewUrl} className="h-32 w-auto rounded-md" controls />
						)}
						<button
							onClick={clearFile}
							className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
						>
							<IoMdClose size={12} />
						</button>
					</div>
				</div>
			)}

			<div className="w-full max-w-[95%] md:max-w-full min-h-[44px] bg-white rounded-[22px] md:rounded-none flex items-end px-2 py-[5px] border border-gray-200 relative">
				{/* Image Upload Button */}
				<div className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors mr-1 ">
					<IoMdImage
						className="text-xl text-gray-600 mt-[7px]"
						onClick={() => document.getElementById("imageInput").click()}
					/>
					<input
						type="file"
						id="imageInput"
						accept="image/*"
						className="hidden"
						onChange={(e) => handleFileSelect(e, 'image')}
					/>
				</div>

				{/* Video Upload Button */}
				<div className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors mr-1 ">
					<IoMdVideocam
						className="text-xl text-gray-600 mt-[7px]"
						onClick={() => document.getElementById("videoInput").click()}
					/>
					<input
						type="file"
						id="videoInput"
						accept="video/*"
						className="hidden"
						onChange={(e) => handleFileSelect(e, 'video')}
					/>
				</div>

				{/* Text Input */}
				<form
					onSubmit={(e) => e.preventDefault()}
					className="w-full overflow-hidden flex items-center">
					<textarea
						value={isEditing ? activeMessage : input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={isEditing ? "Edit message..." : "Message..."}
						className={`w-full outline-none text-[15px] placeholder-gray-500 bg-transparent caret-black resize-none overflow-y-auto ${nunito.className}`}
						style={{
							height: "24px",
							maxHeight: "100px",
							lineHeight: "24px",
							padding: "0 4px",
						}}
						onInput={(e) => {
							const el = e.target;
							el.style.height = "24px";
							el.style.height =
								el.scrollHeight > 100 ? "100px" : `${el.scrollHeight}px`;

							if (e.target.value.length > 0) {
								socket.emit("typing_start", { chatId });
							} else {
								socket.emit("typing_stop", { chatId });
							}
						}}
					/>
				</form>

				{/* Send/Voice/Edit Buttons */}
				<div className="flex items-center gap-1 ml-1 mb-[1px]">
					{isEditing ? (
						<>
							{/* Cancel Edit (X) */}
							<div
								className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
								onClick={() => {
									setIsEditing(false);
									setInput("");
									setActiveMessage(null);
								}}
							>
								<IoMdClose className="text-xl text-gray-600" />
							</div>

							{/* Submit Edit (Upmark/Check) */}
							<div
								className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
								onClick={handleEditSubmit}
							>
								<IoMdCheckmark className="text-xl text-[#7304af]" />
							</div>
						</>
					) : (
						<div className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors">
							{input?.trim().length > 0 ? (
								<IoMdSend
									className={`text-2xl font-semibold text-[#7304af] cursor-pointer ${nunito.className}`}
									onClick={handleSend}
								/>
							) : (
								<MdOutlineKeyboardVoice className="text-2xl text-[#7304af]" />
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatsBottom;
