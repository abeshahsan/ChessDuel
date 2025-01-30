"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChessboardUI from "../../../global-components/chessboard/chessboard";
import NewGameModal from "../../components/new-game-modal";
import { Chess } from "chess.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { addEventHandler, subscribe, unsubscribeComponent } from "../../../store/client_socket_slice";
import { createMatch, MatchState } from "../../../store/match_slice";

import { useParams } from "next/navigation";

const JoinMatch = () => {
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
			dispatch(subscribe(JoinMatch.name));
			dispatch(
				addEventHandler({
					subscriberName: JoinMatch.name,
					event: "match-joined",
					callback: (match: MatchState) => {
						console.log("Match joined: ", match);

						setGameUrl(window.location.origin + "/match/join/" + match.id);
						dispatch(createMatch(match));
					},
				})
			);
			socket.emit("join-match", id);
		}

		return () => {
			if (socket?.active) {
				dispatch(unsubscribeComponent(JoinMatch.name));
			}
		};
	}, [socket?.active, dispatch]);

	return (
		<div className={"w-3/4 md:w-2/5 h-screen mx-auto"}>
			<ChessboardUI
				game={game}
				setGame={setGame}
			/>
			<NewGameModal
				isOpen={isOpen}
				gameurl={gameUrl}
			/>
		</div>
	);
};

export default JoinMatch;
