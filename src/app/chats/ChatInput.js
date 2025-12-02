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
            className="w-full overflow-hidden flex items-center">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isEditing ? "Edit message..." : "Message..."}
                className={`w-full outline-none text-[15px] placeholder-gray-500 bg-transparent caret-black resize-none overflow-y-auto ${fontClassName}`}
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
