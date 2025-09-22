import React from 'react'

const Security = () => {
  return (
		<div className="flex flex-col space-y-3 p-4">
			{/* Title */}
			<h2 className="text-lg font-semibold">Security</h2>
			<p className="text-sm text-gray-600">Your chats and calls are private</p>
			<p className="text-sm text-gray-600">
				End-to-end encryption keeps your personal messages and calls between you
				and the people you choose. No one outside of the chat, not even
				Chatterbox, can read, listen to, or share them. This includes your:
			</p>

			{/* Items with icons */}
			<div className="flex flex-row items-center space-x-2">
				<span>💬</span>
				<span className="text-sm text-gray-700">Text and voice messages</span>
			</div>
			<div className="flex flex-row items-center space-x-2">
				<span>📞</span>
				<span className="text-sm text-gray-700">Audio and video calls</span>
			</div>
			<div className="flex flex-row items-center space-x-2">
				<span>📎</span>
				<span className="text-sm text-gray-700">
					Photos, videos and documents
				</span>
			</div>
			<div className="flex flex-row items-center space-x-2">
				<span>📍</span>
				<span className="text-sm text-gray-700">Location sharing</span>
			</div>
			<div className="flex flex-row items-center space-x-2">
				<span>📝</span>
				<span className="text-sm text-gray-700">Status updates</span>
			</div>
		</div>
	);
}

export default Security
