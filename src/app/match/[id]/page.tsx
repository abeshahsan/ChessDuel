"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import ChessboardUI from "@/app/global-components/chessboard/chessboard";
import AuthGuard from "@/app/components/AuthGuard";
import { RootState } from "@/app/store";
import { addEventHandler, subscribe, unsubscribeComponent } from "@/app/store/client_socket_slice";

import { updateMatch } from "@/app/store/match_slice";

type CapturedPiece = { color: "w" | "b"; type: "p" | "n" | "b" | "r" | "q" | "k" };

const MatchContent = () => {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();
	const params = useParams();

	const id = params?.id as string | undefined;

	const [game, setGame] = useState(new Chess());
	const [captured, setCaptured] = useState<CapturedPiece[]>([]);
	const [finished, setFinished] = useState<any>(null);

	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(subscribe(Match.name));
		if (socket?.active && id) {
			socket.emit("get-match", id);
			dispatch(
				addEventHandler({
					subscriberName: Match.name,
					event: "match-found",
					callback: (match) => {
						dispatch(updateMatch(match));
						if (match?.fen) {
							try {
								setGame(new Chess(match.fen));
							} catch {}
						}
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: Match.name,
					event: "match-state",
					callback: (state) => {
						if (state?.fen) {
							try {
								setGame(new Chess(state.fen));
							} catch {}
						}
						// Track captured pieces from last move if any
						const lm = state?.lastMove;
						if (lm?.captured) {
							const capturedColor: "w" | "b" = lm.color === "w" ? "b" : "w";
							const capturedType = lm.captured as CapturedPiece["type"];
							setCaptured((prev) => [...prev, { color: capturedColor, type: capturedType }]);
						}
						// Handle finished state for dialogs
						if (state?.finished) setFinished(state.finished);
					},
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: Match.name,
					event: "match-not-found",
					callback: () => router.push("/match/new"),
				})
			);
		}
		return () => {
			dispatch(unsubscribeComponent(Match.name));
		};
	}, [socket?.active, id]);

	return (
		<div className={"w-full max-w-[800px] px-2 md:px-0 h-screen mx-auto flex flex-col"}>
			<ChessboardUI
				game={game}
				setGame={setGame}
				matchId={id as string}
				capturedPieces={captured}
				finished={finished}
			/>
		</div>
	);
};

export default function Match() {
	return (
		<AuthGuard>
			<MatchContent />
		</AuthGuard>
	);
}
