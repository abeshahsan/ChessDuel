"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ChessboardUI from "../global-components/chessboard/chessboard";
import NewGameModal from "./components/new-game-modal";

const Modal = () => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();

	return (
		<div className={"w-3/4 md:w-2/5 h-screen mx-auto"}>
			<ChessboardUI />
			{isOpen && <NewGameModal isOpen={isOpen} />}
		</div>
	);
};

export default Modal;
