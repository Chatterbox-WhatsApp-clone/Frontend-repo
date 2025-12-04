import { createPortal } from "react-dom";

const Modal = ({ children }) =>
	createPortal(
		
		<div className="fixed inset-0 h-full flex justify-center items-center bg-black/50 z-[100] shadow-lg">
			{children}
		</div>,
		document.body
	);

export default Modal;
