"use client";
import React, { useEffect, useState, useRef } from "react";
import {
	IoMdSend,
	IoMdImage,
	IoMdClose,
	IoMdCheckmark,
	IoMdVideocam,
} from "react-icons/io";
import { MdOutlineKeyboardVoice, MdStop } from "react-icons/md";
import { Nunito } from "next/font/google";

import { useAuthenticatedStore, useUserProfile } from "@/zustand";
import { socket } from "@/socket";
import Preview from "./Preview";
import RecordingIndicator from "./RecordingIndicator";
import ChatInput from "./ChatInput";
import { useQueryClient } from "@tanstack/react-query";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const ChatsBottom = () => {
	const [input, setInput] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [fileType, setFileType] = useState(null);
	const [uploading, setUploading] = useState(false);
	const queryClient = useQueryClient();

	// Recording
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);

	const { userId, token } = useAuthenticatedStore();
	const {
		activeUser,
		isEditing,
		setIsEditing,
		activeMessage,
		setActiveMessage,
		chatId,
	} = useUserProfile();

	/** AUTHENTICATE SOCKET **/
	useEffect(() => {
		if (userId && token) {
			socket.emit("authenticate", { userId, token });
		}
	}, [userId, token]);

	/** POPULATE INPUT WHEN EDITING **/
	useEffect(() => {
		if (isEditing && activeMessage) {
			setInput(activeMessage.content || activeMessage.message || "");
		}
	}, [isEditing, activeMessage]);

	/*********************************
	 * FILE HANDLERS
	 *********************************/
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

		document.getElementById("imageInput").value = "";
		document.getElementById("videoInput").value = "";
	};

	/*********************************
	 * VOICE RECORDING
	 *********************************/
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data);
			};

			mediaRecorderRef.current.onstop = uploadVoiceNote;

			mediaRecorderRef.current.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Microphone error:", err);
		}
	};

	const stopRecording = (send = true) => {
		if (mediaRecorderRef.current) {
			if (!send) {
				mediaRecorderRef.current.onstop = null;
			}
			mediaRecorderRef.current.stop();
			setIsRecording(false);

			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
		}
	};

	const uploadVoiceNote = async () => {
		if (audioChunksRef.current.length === 0) return;

		const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
		const file = new File([blob], "voicenote.webm", { type: "audio/webm" });

		const formData = new FormData();
		formData.append("voicenote", file);

		try {
			const backendBase =
				process.env.NEXT_PUBLIC_BACKEND_BASE || "http://localhost:5001";

			const res = await fetch(`${backendBase}/api/voicenotes`, {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			if (data.url) sendAudioMessage(data.url, data.filename);
		} catch (err) {
			console.log("Voice upload error", err);
		}
	};

	const sendAudioMessage = (url, filename) => {
		socket.emit("send_message", {
			chatId,
			type: "audio",
			media: { url, filename, mimeType: "audio/webm" },
			receiverId: activeUser?._id,
		});
	};

	/*********************************
	 * SEND MESSAGE
	 *********************************/
	const handleSend = async () => {
		const textExists = input.trim().length > 0;
		const fileExists = !!selectedFile;

		if (!textExists && !fileExists) return;

		/** MEDIA UPLOAD **/
		if (fileExists) {
			setUploading(true);
			try {
				const formData = new FormData();
				formData.append(fileType, selectedFile);

				let endpoint =
					fileType === "image"
						? process.env.NEXT_PUBLIC_UPLOAD_IMAGE
						: process.env.NEXT_PUBLIC_UPLOAD_VIDEO;

				endpoint = endpoint.replace("{chatId}", chatId);

				await fetch(endpoint, {
					method: "POST",
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				});
			} catch (err) {
				console.log("Upload error:", err);
			}
			clearFile();
			setUploading(false);
		}

		/** TEXT MESSAGE **/

		// No active user → don't send anything
		if (textExists) {
			if (!activeUser?._id) {
				// Send using HTTP
				const endpoint = process.env.NEXT_PUBLIC_SEND_MESSAGE.replace(
					"{chatId}",
					chatId
				);

				await fetch(endpoint, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						chatId: chatId,
						content: input,
					}),
				});
			} else {
				// Send using socket
				socket.emit("send_message", {
					chatId,
					type: "text",
					content: input,
					receiverId: activeUser._id,
				});
			}

			setInput("");
			queryClient.invalidateQueries({ queryKey: ["all_messages"] });
			queryClient.invalidateQueries({ queryKey: ["users-chat"] });
			queryClient.invalidateQueries({ queryKey: ["chat_messages"] });
		}

		socket.emit("typing_stop", { chatId });
	};

	/*********************************
	 * EDIT MESSAGE
	 *********************************/
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

			setIsEditing(false);
			setInput("");
			setActiveMessage(null);
		} catch (err) {
			console.log("Edit error:", err);
		}
	};

	/*********************************
	 * UI
	 *********************************/
	return (
		<div className="absolute pt-[2px] bottom-0 w-full flex flex-row items-end justify-center pb-1 md:pb-0 md:pt-0 bg-transparent bg-opacity-70 backdrop-blur-md md:bg-white rounded-sm">
			{/* FILE PREVIEW */}
			<Preview
				previewUrl={previewUrl}
				fileType={fileType}
				onClear={clearFile}
			/>

			{/* INPUT BOX */}
			<div className="w-full max-w-[95%] md:max-w-full min-h-[44px] bg-white rounded-[22px] md:rounded-none flex items-end px-2 border border-gray-200 relative py-[1px]">
				{/* IMAGE UPLOAD */}
				<div
					className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer mt-[2px]"
					onClick={() => document.getElementById("imageInput").click()}>
					<IoMdImage className="text-xl text-gray-700 mt-1" />
					<input
						id="imageInput"
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => handleFileSelect(e, "image")}
					/>
				</div>

				{/* VIDEO UPLOAD */}
				<div
					className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
					onClick={() => document.getElementById("videoInput").click()}>
					<IoMdVideocam className="text-xl text-gray-700 mt-1" />
					<input
						id="videoInput"
						type="file"
						accept="video/*"
						className="hidden"
						onChange={(e) => handleFileSelect(e, "video")}
					/>
				</div>

				{/* TEXT INPUT OR RECORDING */}
				<div className="flex-1">
					{isRecording ? (
						<RecordingIndicator />
					) : (
						<ChatInput
							input={input}
							setInput={setInput}
							isEditing={isEditing}
							activeMessage={activeMessage}
							onTyping={(typing) =>
								socket.emit(typing ? "typing_start" : "typing_stop", { chatId })
							}
							fontClassName={nunito.className}
						/>
					)}
				</div>

				{/* ACTION BUTTONS */}
				<div className="flex items-center gap-2">
					{/* EDIT MODE BUTTONS */}
					{isEditing ? (
						<>
							<div
								className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
								onClick={() => {
									setIsEditing(false);
									setInput("");
									setActiveMessage(null);
								}}>
								<IoMdClose className="text-xl text-gray-600" />
							</div>

							<div
								className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
								onClick={handleEditSubmit}>
								<IoMdCheckmark className="text-xl text-purple-700" />
							</div>
						</>
					) : (
						<>
							{/* RECORDING MODE BUTTONS */}
							{isRecording ? (
								<>
									<div
										className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
										onClick={() => stopRecording(false)}>
										<IoMdClose className="text-xl text-red-500" />
									</div>

									<div
										className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
										onClick={() => stopRecording(true)}>
										<IoMdSend className="text-2xl text-purple-700" />
									</div>
								</>
							) : (
								<>
									{/* NORMAL SEND / VOICE BUTTON */}
									{/* {input.trim().length > 0 || previewUrl ? (
										
									) : (
										<div
											className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
											onClick={startRecording}>
											<MdOutlineKeyboardVoice className="text-2xl text-purple-700" />
										</div>
									)} */}
									<div
										className="h-10 w-10 flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
										onClick={handleSend}>
										<IoMdSend className="text-2xl text-purple-700" />
									</div>
								</>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatsBottom;
