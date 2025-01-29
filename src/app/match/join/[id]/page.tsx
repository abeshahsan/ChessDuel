"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChessboardUI from "../../../global-components/chessboard/chessboard";
import NewGameModal from "../../components/new-game-modal";
import { Chess } from "chess.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { addEventHandler, subscribe } from "../../../store/client_socket_slice";
import { MatchState } from "../../../store/match_slice";

const JoinMatch = () => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();

	const [game, setGame] = useState(new Chess());
	const [gameUrl, setGameUrl] = useState<string>();

	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const dispatch = useDispatch();

	dispatch(subscribe(JoinMatch.name));

	useEffect(() => {
		if (socket?.active) {
			socket.emit("create-match");
			dispatch(
				addEventHandler({
					subscriberName: JoinMatch.name,
					event: "match-created",
					callback: (match: MatchState) => {
						setGameUrl(match.id);
					},
				})
			);
		}
	}, [socket?.active]);

	return (
		<div className={"w-3/4 md:w-2/5 h-screen mx-auto"}>
			<ChessboardUI
				game={game}
				setGame={setGame}
			/>
			<NewGameModal isOpen={isOpen} gameurl={gameUrl}/>
		</div>
	);
};

export default JoinMatch;
