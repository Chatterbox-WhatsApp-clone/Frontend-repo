import React from "react";
import { IoMdClose } from "react-icons/io";

const Preview = ({ previewUrl, fileType, onClear }) => {
    if (!previewUrl) return null;

    return (
        <div className="absolute bottom-12 left-0 w-full bg-white p-2 border-t border-gray-200 flex flex-col gap-2 z-10">
            <div className="relative w-fit">
                {fileType === "image" ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-32 w-auto rounded-md object-cover"
                    />
                ) : (
                    <video
                        src={previewUrl}
                        className="h-32 w-auto rounded-md"
                        controls
                    />
                )}
                <button
                    onClick={onClear}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
                    <IoMdClose size={12} />
                </button>
            </div>
        </div>
    );
};

export default Preview;
