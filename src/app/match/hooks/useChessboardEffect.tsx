import ChessboardUI from "@/app/global-components/chessboard/chessboard";
import { addEventHandler, subscribe, unsubscribeComponent } from "@/app/store/client_socket_slice";
import { createMatch } from "@/app/store/match_slice";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { Chess, Square } from "chess.js";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

const useChessboardEffect = (socket: Socket | null, game: Chess, setGame: any, dispatch: Dispatch<UnknownAction>) => {
	useEffect(() => {
		if (socket?.active) {
			dispatch(subscribe(ChessboardUI.name));
			dispatch(
				addEventHandler({
					subscriberName: ChessboardUI.name,
					event: "chess-move",
					callback: (move: { from: Square; to: Square }) => {
						try {
							game.move(move);
							setGame(() => {
								return new Chess(game.fen());
							});
						} catch (error) {
							// console.log("Invalid move", error);
						}
					},
				})
			);
		}

		return () => {
			unsubscribeComponent(ChessboardUI.name);
		};
	}, [socket?.active]);
};

export default useChessboardEffect;
