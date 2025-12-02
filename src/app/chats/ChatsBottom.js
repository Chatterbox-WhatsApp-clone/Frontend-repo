import React, { useEffect, useState, useRef } from "react";
import { MdOutlineKeyboardVoice, MdStop } from "react-icons/md";
import {
	IoMdSend,
	IoMdImage,
	IoMdClose,
	IoMdCheckmark,
	IoMdVideocam,
} from "react-icons/io";
import { Nunito } from "next/font/google";
import {
	useAuthenticatedStore,
	useUserProfile,
	useMessagesStore,
} from "@/zustand";
import { socket } from "@/socket";
import { generateChatId } from "@/utils/GenerateChatId";
import Preview from "./Preview";
import RecordingIndicator from "./RecordingIndicator";
import ChatInput from "./ChatInput";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "1000", "900"],
});

const ChatsBottom = () => {
	const [input, setInput] = useState("");
	const [selectedFile, setSelectedFile] = useState(false);
	const [previewUrl, setPreviewUrl] = useState(false);
	const [fileType, setFileType] = useState(false); // 'image' or 'video'
	const [uploading, setUploading] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef(false);
	const audioChunksRef = useRef([]);

	const { userId, token } = useAuthenticatedStore();
	const {
		activeUser,
		isEditing,
		setIsEditing,
		activeMessage,
		setActiveMessage,
	} = useUserProfile();

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

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorderRef.current.onstop = handleVoiceNoteUpload;

			mediaRecorderRef.current.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Error accessing microphone:", err);
			alert("Could not access microphone");
		}
	};

	const stopRecording = (shouldSend = true) => {
		if (mediaRecorderRef.current && isRecording) {
			if (!shouldSend) {
				mediaRecorderRef.current.onstop = null; // Prevent upload
			}
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
		}
	};

	const handleVoiceNoteUpload = async () => {
		if (audioChunksRef.current.length === 0) return;
		const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
		const audioFile = new File([audioBlob], "voicenote.webm", {
			type: "audio/webm",
		});

		const formData = new FormData();
		formData.append("voicenote", audioFile);

		try {
			const backendBase =
				process.env.NEXT_PUBLIC_BACKEND_BASE || "http://localhost:5001";
			const res = await fetch(`${backendBase}/api/voicenotes`, {
				method: "POST",
				body: formData,
			});

			if (!res.ok) throw new Error("Voice upload failed");

			const data = await res.json();
			if (data.url) {
				sendVoiceMessage(data.url, data.filename);
			}
		} catch (err) {
			console.error("Voice note upload error", err);
		}
	};

	const sendVoiceMessage = async (url, filename) => {
		const isOnline = activeUser?.isOnline;

		if (isOnline) {
			socket.emit("send_message", {
				chatId,
				type: "audio",
				content: "",
				media: {
					url: url,
					filename: filename,
					mimeType: "audio/webm",
				},
				receiverId: activeUser?._id,
			});
		} else {
			try {
				const endpoint = process.env.NEXT_PUBLIC_POST_MESSAGES.replace(
					"{chatId}",
					chatId
				);
				await fetch(endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						type: "audio",
						content: {
							media: {
								url: url,
								filename: filename,
								mimeType: "audio/webm",
							},
						},
					}),
				});
			} catch (err) {
				console.error("Voice send error", err);
			}
		}
		socket.emit("typing_stop", { chatId });
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

				let endpoint =
					fileType === "image"
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
			if (input.trim()) {
				const isOnline = activeUser?.isOnline;

				if (isOnline) {
					socket.emit("send_message", {
						chatId,
						content: input,
						type: "text",
						receiverId: activeUser?._id,
					});
				} else {
					try {
						const endpoint = process.env.NEXT_PUBLIC_POST_MESSAGES.replace(
							"{chatId}",
							chatId
						);
						await fetch(endpoint, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify({
								type: "text",
								content: { text: input },
							}),
						});
					} catch (err) {
						console.error("Text send error", err);
					}
				}
				setInput("");
				socket.emit("typing_stop", { chatId });
			}
		}

		const handleEditSubmit = async () => {
			if (!input.trim() || !activeMessage?._id) return;

			try {
				const res = await fetch(
					process.env.NEXT_PUBLIC_EDIT_MESSAGE.replace(
						"{messageId}",
						activeMessage._id
					),
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

		
	};
	return (
		<div className="fixed bottom-[1px] md:bottom-0 w-full flex flex-row items-end justify-center pb-1 md:pb-0 md:pt-0 bg-transparent bg-opacity-70 backdrop-blur-md md:bg-red-500 pt-1 z-50">
			{/* Preview Area */}
			<Preview
				previewUrl={previewUrl}
				fileType={fileType}
				onClear={clearFile}
			/>

			<div className="w-full max-w-[95%] md:max-w-full min-h-[44px] bg-white rounded-[22px] md:rounded-none flex items-end px-2 py-[5px] border border-gray-200 relative">
				{/* Image Upload Button */}
				<div className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors mr-1">
					<IoMdImage
						className="text-xl text-gray-600 mt-[7px]"
						onClick={() => document.getElementById("imageInput").click()}
					/>
					<input
						type="file"
						id="imageInput"
						accept="image/*"
						className="hidden"
						onChange={(e) => handleFileSelect(e, "image")}
					/>
				</div>

				{/* Video Upload Button */}
				<div className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors mr-1">
					<IoMdVideocam
						className="text-xl text-gray-600 mt-[7px]"
						onClick={() => document.getElementById("videoInput").click()}
					/>
					<input
						type="file"
						id="videoInput"
						accept="video/*"
						className="hidden"
						onChange={(e) => handleFileSelect(e, "video")}
					/>
				</div>

				{/* Text Input or Recording Indicator */}
				{isRecording ? (
					<RecordingIndicator />
				) : (
					<ChatInput
						input={input}
						setInput={setInput}
						isEditing={isEditing}
						activeMessage={activeMessage}
						onTyping={(isTyping) => {
							if (isTyping) {
								socket.emit("typing_start", { chatId });
							} else {
								socket.emit("typing_stop", { chatId });
							}
						}}
						fontClassName={nunito.className}
					/>
				)}

				{/* Send / Edit / Recording Buttons */}
				<div className="flex items-center gap-1 ml-1 mb-[1px]">
					{isEditing ? (
						<>
							{/* Cancel Edit */}
							<div
								className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
								onClick={() => {
									setIsEditing(false);
									setInput("");
									setActiveMessage(null);
								}}>
								<IoMdClose className="text-xl text-gray-600" />
							</div>

							{/* Submit Edit */}
							<div
								className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
								onClick={handleEditSubmit}>
								<IoMdCheckmark className="text-xl text-[#7304af]" />
							</div>
						</>
					) : (
						<>
							{isRecording ? (
								<>
									<div
										className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
										onClick={() => stopRecording(false)}>
										<IoMdClose className="text-xl text-red-500" />
									</div>

									<div
										className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
										onClick={() => stopRecording(true)}>
										<IoMdSend
											className={`text-2xl font-semibold text-[#7304af] cursor-pointer ${nunito.className}`}
										/>
									</div>
								</>
							) : (
								<div
									className="h-[34px] w-[34px] flex justify-center items-center shrink-0 cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
									onClick={handleSend}>
									<IoMdSend
										className={`text-2xl font-semibold text-[#7304af] cursor-pointer ${nunito.className}`}
									/>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatsBottom;
