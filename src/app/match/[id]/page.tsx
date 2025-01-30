"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { useDispatch, useSelector } from "react-redux";

import ChessboardUI from "@/app/global-components/chessboard/chessboard";
import { RootState } from "@/app/store";
import {  subscribe, unsubscribeComponent } from "@/app/store/client_socket_slice";

import { useParams } from "next/navigation";

const Match = () => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();
	const params = useParams();

	const id = params?.id as string | undefined;

	const [game, setGame] = useState(new Chess());
	const [gameUrl, setGameUrl] = useState<string | null>(null);

	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const dispatch = useDispatch();

	useEffect(() => {
		if (socket?.active) {
			dispatch(subscribe(Match.name));
			
			
		}

		return () => {
			if (socket?.active) {
				dispatch(unsubscribeComponent(Match.name));
			}
		};
	}, [socket?.active, dispatch]);

	return (
		<div className={"w-3/4 md:w-2/5 h-screen mx-auto"}>
			<ChessboardUI
				game={game}
				setGame={setGame}
			/>
		</div>
	);
};

export default Match;
