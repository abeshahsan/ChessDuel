"use client";

import React, { useEffect, useState } from "react";
import { CSSProperties } from "react";
import { Chess, Piece } from "chess.js";
import { Chessboard } from "react-chessboard";
import * as PieceIcons from "@/app/global-components/piece_icons/piece_icons";

type Props = {};

interface ICustomPieces {
	[key: string]: ({ style }: { style: CSSProperties }) => React.JSX.Element;
}

const getPieceIocnsKey = (color: string, type: string): string => {
	color = color.toLowerCase();
	type = type.toLowerCase();

	return color + type.toUpperCase();
};

const pieceIcons: ICustomPieces = {
	wK: ({ style }: { style: CSSProperties }) => <PieceIcons.WhiteKing style={style} />,
	wQ: ({ style }: { style: CSSProperties }) => <PieceIcons.WhiteQueen style={style} />,
	wR: ({ style }: { style: CSSProperties }) => <PieceIcons.WhiteRook style={style} />,
	wN: ({ style }: { style: CSSProperties }) => <PieceIcons.WhiteKnight style={style} />,
	wB: ({ style }: { style: CSSProperties }) => <PieceIcons.WhiteBishop style={style} />,
	wP: ({ style }: { style: CSSProperties }) => <PieceIcons.WhitePawn style={style} />,
	bK: ({ style }: { style: CSSProperties }) => <PieceIcons.BlackKing style={style} />,
	bQ: ({ style }: { style: CSSProperties }) => <PieceIcons.BlackQueen style={style} />,
	bR: ({ style }: { style: CSSProperties }) => <PieceIcons.BlackRook style={style} />,
	bN: ({ style }: { style: CSSProperties }) => <PieceIcons.BlackKnight style={style} />,
	bB: ({ style }: { style: CSSProperties }) => <PieceIcons.BlackBishop style={style} />,
	bP: ({ style }: { style: CSSProperties }) => <PieceIcons.BlackPawn style={style} />,
};

const ChessboardAuto = ({}: Props) => {
	const [game, setGame] = useState(new Chess());

	const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);

	useEffect(() => {
		const t = setTimeout(() => {
			if (game.isGameOver()) {
				setGame(new Chess());
			}
			// make a random move
			const moves = game.moves();
			const move = moves[Math.floor(Math.random() * moves.length)];
			game.move(move);
			setGame(new Chess(game.fen()));
		}, 1000);

		return () => clearTimeout(t);
	}, [game]);

	return (
		<div className={"w-3/4 md:w-2/5 h-screen mx-auto"}>
			<Chessboard
				id='ChessboardWithEvents'
				customPieces={pieceIcons}
				position={game.fen()}
				arePiecesDraggable={false}
			/>
		</div>
	);
};

export default ChessboardAuto;
