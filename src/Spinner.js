"use client"
import { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";

const Spinner = () => {
	let [loading, setLoading] = useState(true);
	const override = {
		display: "block",
		margin: "0 auto",
		borderColor: "red",
		marginTop: '7px'
	};
	return (
		<FadeLoader
			color={"black"}
			loading={loading}
			cssOverride={override}
			size={200}
			aria-label="Loading Spinner"
			data-testid="loader"
		/>
	);
};

export default Spinner;
