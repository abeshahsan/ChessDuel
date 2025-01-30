"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import ChessboardUI from "@/app/global-components/chessboard/chessboard";
import NewGameModal from "@/app/match/components/new-game-modal";
import { RootState } from "@/app/store";
import { addEventHandler, subscribe, unsubscribeComponent } from "@/app/store/client_socket_slice";
import { createMatch, MatchState } from "@/app/store/match_slice";

import { Chess } from "chess.js";

const NewMatch = () => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();

	const [game, setGame] = useState(new Chess());
	const [gameUrl, setGameUrl] = useState<string | null>(null);

	const dispatch = useDispatch();
	const socket = useSelector((state: RootState) => state.clientSocket.socket);

	useEffect(() => {
		if (socket?.active) {
			console.log("Creating new match...");
			
			socket.emit("create-match");
			dispatch(subscribe(NewMatch.name));
			dispatch(
				addEventHandler({
					subscriberName: NewMatch.name,
					event: "match-created",
					callback: (match: MatchState) => {
						setGameUrl(window.location.origin + "/match/join/" + match.id);
						dispatch(createMatch(match));
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: NewMatch.name,
					event: "match-joined",
					callback: (match: MatchState) => {
						console.log("Match joined: ", match);
						setGameUrl(window.location.origin + "/match/join/" + match.id);
						dispatch(createMatch(match));
					},
				})
			);
		}

		return () => {
			if (socket?.active) {
				dispatch(unsubscribeComponent(NewMatch.name));
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

export default NewMatch;
