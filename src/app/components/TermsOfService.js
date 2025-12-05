"use client";

import React, { useState } from "react";

const TermsOfService = ({ termsOpen, setTermsOpen, accepted, setAccepted }) => {
	const handleAccept = () => {
		setAccepted(true);
	};

	// if (!termsOpen) return null; // hide component if termsOpen is false

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto py-6 px-4 w-full">
			<div className="bg-white max-w-3xl w-full rounded-lg shadow-lg p-6 relative">
				<h1 className="text-2xl font-bold mb-3 mt-2">Welcome to ChatterBox!</h1>
				<p className="mb-3">
					By creating an account or using ChatterBox, you agree to the terms
					below. Please read them carefully.
				</p>

				<div className="max-h-[70vh] overflow-y-auto mb-4 space-y-4 ">
					<ol className="list-decimal list-inside space-y-2 text-sm">
						<li>
							<strong>Acceptance of Terms:</strong> By accessing or using
							ChatterBox, you agree to these Terms of Service and our Privacy
							Policy. If you do not agree, please do not use the app.
						</li>
						<li>
							<strong>Eligibility:</strong> You must be at least 13 years old to
							use ChatterBox. If you are using the app on behalf of a company or
							organization, you represent that you have the authority to do so.
						</li>
						<li>
							<strong>Your Account:</strong> You are responsible for maintaining
							the security of your account and password. You agree not to share
							your login details. If you believe your account has been
							compromised, notify us.
						</li>
						<li>
							<strong>Acceptable Use:</strong> You agree not to use ChatterBox
							to:
							<ul className="list-disc list-inside ml-4 mt-1">
								<li>Harass, threaten, or abuse other users</li>
								<li>
									Share hate speech, harmful content, or explicit material
								</li>
								<li>Impersonate another person</li>
								<li>Upload malicious software or attempt to hack</li>
								<li>
									Engage in illegal activities or violate rights of others
								</li>
							</ul>
						</li>
						<li>
							<strong>Messaging and Content:</strong> You are responsible for
							any content you share. You own or have permission to share the
							content, and ChatterBox may temporarily store and process it. We
							do not claim ownership.
						</li>
						<li>
							<strong>Privacy:</strong> Your privacy is important to us. Our
							Privacy Policy explains how we handle your data.
						</li>
						<li>
							<strong>Friend Requests and Connections:</strong> You may
							send/receive requests, block/unblock users, and abuse may result
							in restrictions.
						</li>
						<li>
							<strong>Service Availability:</strong> We do our best to keep
							ChatterBox running, but we do not guarantee constant availability
							or data safety.
						</li>
						<li>
							<strong>Third-Party Services:</strong> Some features rely on
							third-party services. We are not responsible for issues caused by
							those providers.
						</li>
						<li>
							<strong>Termination:</strong> We may suspend/terminate accounts
							for violations or misuse. Users may delete their account at any
							time.
						</li>
						<li>
							<strong>Limitation of Liability:</strong> ChatterBox is provided
							"as is." We are not liable for damages or losses, and make no
							warranties.
						</li>
						<li>
							<strong>Changes to Terms:</strong> We may update terms and notify
							users. Continued use means acceptance.
						</li>
						<li>
							<strong>Contact:</strong> For support or questions, contact us at:{" "}
							<a
								href="mailto:pricelesswilliams1234@gmail.com"
								className="text-purple-700 underline">
								pricelesswilliams1234@gmail.com
							</a>
						</li>
					</ol>
				</div>

				{/* Checkbox to accept */}
				<div className="flex items-center gap-2 mt-4">
					<input
						type="checkbox"
						id="acceptTerms"
						checked={accepted}
						onChange={handleAccept}
						disabled={!termsOpen} // disable if termsOpen is false
						className={`w-5 h-5 rounded border-gray-400 ${
							accepted ? "bg-purple-700" : "bg-white"
						}`}
					/>
					<label htmlFor="acceptTerms" className="text-sm">
						I have read and agree to the Terms of Service
					</label>
				</div>
				<div className="flex justify-center">
					<button disabled={!accepted}
						onClick={() => {
							setTermsOpen(false);
						}}
						className={`text-center mt-3 w-40 h-8 rounded-3xl cursor-pointer font-extrabold text-white flex justify-center items-center ${
							accepted
								? "bg-purple-700 shadow-md hover:shadow-lg"
								: "bg-gray-300 shadow-inner cursor-not-allowed"
						}`}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default TermsOfService;
