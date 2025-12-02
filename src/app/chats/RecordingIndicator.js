import React from "react";

const RecordingIndicator = () => {
    return (
        <div className="w-full flex items-center px-2 h-[24px]">
            <span className="text-red-500 font-semibold animate-pulse">
                Recording...
            </span>
        </div>
    );
};

export default RecordingIndicator;
