"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { BsMicMute, BsMic } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";

export default function VoiceCall({ onEndCall, callStatus, setOpenVoiceCall }) {
	const [mute, setMute] = useState(false);
	const [speaker, setSpeaker] = useState(false);
	const [timer, setTimer] = useState(0);

	const ringtone = useRef(null);
	const peerConnection = useRef(null);
	const localStream = useRef(null);
	const remoteAudio = useRef(null);
	const timerInterval = useRef(null);

	// -----------------------------------------
	// 🎵 RINGTONE HANDLING (WhatsApp Web style)
	// -----------------------------------------
	useEffect(() => {
		if (callStatus === "calling" || callStatus === "ringing") {
			ringtone.current = new Audio("/sounds/ringtone.mp3");
			ringtone.current.loop = true;

			ringtone.current.play().catch(() => {});
		} else {
			if (ringtone.current) {
				ringtone.current.pause();
				ringtone.current.currentTime = 0;
			}
		}
	}, [callStatus]);

	// -----------------------------------------
	// 🕒 CALL TIMER
	// -----------------------------------------
	useEffect(() => {
		if (callStatus === "connected") {
			timerInterval.current = setInterval(() => {
				setTimer((t) => t + 1);
			}, 1000);
		} else {
			clearInterval(timerInterval.current);
		}

		return () => clearInterval(timerInterval.current);
	}, [callStatus]);

	const formatTime = () => {
		const mins = Math.floor(timer / 60);
		const secs = timer % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	};

	// -----------------------------------------
	// 🎙  WEBRTC AUDIO-ONLY STREAM
	// -----------------------------------------
	const startCall = async () => {
		peerConnection.current = new RTCPeerConnection();

		localStream.current = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		localStream.current.getTracks().forEach((track) => {
			peerConnection.current.addTrack(track, localStream.current);
		});

		peerConnection.current.ontrack = (e) => {
			remoteAudio.current.srcObject = e.streams[0];
		};
	};

	// -----------------------------------------
	// 🔇 TOGGLE MUTE
	// -----------------------------------------
	const toggleMute = () => {
		setMute((m) => !m);
		localStream.current.getAudioTracks()[0].enabled = mute; // reverse
	};

	// -----------------------------------------
	// 🔊 SPEAKER MODE (browser limited)
	// -----------------------------------------
	const toggleSpeaker = () => {
		setSpeaker((s) => !s);
		remoteAudio.current.volume = speaker ? 1 : 0.35;
	};

	// -----------------------------------------
	// ❌ END CALL
	// -----------------------------------------
	const endCall = () => {
		if (ringtone.current) {
			ringtone.current.pause();
		}

		if (localStream.current) {
			localStream.current.getTracks().forEach((t) => t.stop());
		}

		if (peerConnection.current) {
			peerConnection.current.close();
		}

		clearInterval(timerInterval.current);

		onEndCall && onEndCall();
	};

	useEffect(() => {
		if (callStatus === "connecting") {
			startCall();
		}
	}, [callStatus]);

	return (
		<div
			className="fixed inset-0 top-0 z-50 w-full h-screen md:h-[70vh] md:w-[75%] flex flex-col justify-between items-center p-6 text-white cursor-pointer rounded-md"
			style={{
				backgroundImage: "url(/assets/images/chatBackground.jpg)",
				backgroundSize: "contain",
				backgroundRepeat: "repeat",
				backgroundPosition: "top left",
			}}>
			{/* Glassy overlay */}
			<div className="absolute inset-0 bg-black/30"></div>

			{/* TOP STATUS */}
			<div className="relative z-10 flex flex-col items-center justify-center mt-8  cursor-pointer">
				<p className="text-base font-semibold">In Call</p>
				<p className="text-lg font-bold" style={{ color: "#7304af" }}>
					{callStatus === "connected"
						? formatTime()
						: callStatus === "ringing"
						? "Ringing..."
						: "Calling..."}
				</p>
			</div>

			{/* Hidden Remote Audio */}
			<audio ref={remoteAudio} autoPlay />

			{/* CONTROLS */}
			<div className="relative z-10 flex flex-row items-center gap-10 mb-14  cursor-pointer">
				{/* SPEAKER */}
				<button
					// onClick={toggleSpeaker}
					className="p-5 bg-white/15 backdrop-blur-lg rounded-full">
					{speaker ? (
						<IoVolumeHighOutline className="text-3xl" />
					) : (
						<IoVolumeMuteOutline className="text-3xl" />
					)}
				</button>

				{/* END CALL */}
				<button
					onClick={() => setOpenVoiceCall(false)}
					className="p-6 bg-red-600 rounded-full shadow-lg  cursor-pointer">
					<MdCallEnd className="text-3xl text-white" />
				</button>

				{/* MUTE */}
				<button
					// onClick={toggleMute}
					disabled={callStatus !== "connected"}
					className={`p-5 rounded-full  cursor-pointer ${
						callStatus !== "connected"
							? "bg-gray-400 opacity-50"
							: "bg-white/15 backdrop-blur-lg"
					}`}>
					{mute ? (
						<BsMicMute className="text-3xl" />
					) : (
						<BsMic className="text-3xl" />
					)}
				</button>
			</div>
		</div>
	);
}
