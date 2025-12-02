import React from "react";

const ChatInput = ({
	input,
	setInput,
	isEditing,
	activeMessage,
	onTyping,
	fontClassName,
}) => {
	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			className="w-full overflow-hidden ">
			<textarea
				value={isEditing ? activeMessage : input}
				onChange={(e) => setInput(e.target.value)}
				placeholder={isEditing ? "Edit message..." : "Message..."}
				className={`w-full outline-none text-[14px] placeholder-gray-500 bg-transparent caret-purple-700 resize-none overflow-y-auto px-1 ${fontClassName} `}
				style={{
					height: "22px",
					maxHeight: "120px",
					lineHeight: "22px",
				}}
				onInput={(e) => {
					const el = e.target;
					el.style.height = "22px";
					el.style.height =
						el.scrollHeight > 120 ? "120px" : `${el.scrollHeight}px`

					if (e.target.value.length > 0) {
						onTyping(true);
					} else {
						onTyping(false);
					}
				}}
			/>
		</form>
	);
};

export default ChatInput;
