import React from "react";

const PageWrapper = ({ children }) => {
	return (
		<div className="overflow-y-auto md:border-r md:border-r-gray-100 md:shadow-[3px_0_4px_-1px_rgba(0,0,0,0.1)]">
			{children}
		</div>
	);
};

export default PageWrapper;
