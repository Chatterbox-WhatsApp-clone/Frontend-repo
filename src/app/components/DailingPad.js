import { useState } from "react";
const DailingPad = ({ phoneNumber, onNumberChange, onCall, onBack }) => {
	const [showDialingPad, setShowDialingPad] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const dialPadNumbers = [
		["1", "2", "3"],
		["4", "5", "6"],
		["7", "8", "9"],
		["*", "0", "#"],
	];

	const handleNumberClick = (num) => {
		onNumberChange(phoneNumber + num);
	};

	const handleBackspace = () => {
		onNumberChange(phoneNumber.slice(0, -1));
	};

	const handleCall = () => {
		if (phoneNumber) {
			// Handle the call logic here
			
			// You can add your call functionality here
		}
	};

	const handleBack = () => {
		setShowDialingPad(false);
		setPhoneNumber("");
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center px-6 py-8 relative">
			{/* Back Button */}
			<button
				onClick={onBack}
				className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-[#128C7E] transition-all shadow-sm z-10">
				<IoArrowBack className="text-xl text-gray-700" />
			</button>

			{/* Phone Number Display */}
			<div className="mb-8">
				<p
					className={`text-3xl font-semibold text-gray-900 ${poppins.className}`}>
					{phoneNumber || "Enter number"}
				</p>
			</div>

			{/* Dialing Pad */}
			<div className="flex flex-col gap-4 mb-8">
				{dialPadNumbers.map((row, rowIndex) => (
					<div key={rowIndex} className="flex gap-4 justify-center">
						{row.map((num) => (
							<button
								key={num}
								onClick={() => handleNumberClick(num)}
								className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold ${poppins.className} bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-[#128C7E] transition-all shadow-sm`}>
								{num}
							</button>
						))}
					</div>
				))}
			</div>

			{/* Backspace Button */}
			<button
				onClick={handleBackspace}
				disabled={!phoneNumber}
				className={`mb-8 w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-[#128C7E] transition-all shadow-sm ${
					!phoneNumber ? "opacity-50 cursor-not-allowed" : ""
				}`}>
				<IoBackspaceOutline className="text-2xl text-gray-700" />
			</button>

			{/* Call Button */}
			<button
				onClick={onCall}
				disabled={!phoneNumber}
				className={`w-16 h-16 rounded-full flex items-center justify-center bg-[#128C7E] hover:bg-[#0b5d54] transition-colors shadow-lg ${
					!phoneNumber ? "opacity-50 cursor-not-allowed" : ""
				}`}>
				<FiPhone className="text-2xl text-white" />
			</button>
		</div>
	);
};

export default DailingPad;
