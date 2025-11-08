import { Chess, Piece, Square } from "chess.js";
import { CSSProperties } from "react";

export type CapturedPieceLike = { 
	color: "w" | "b"; 
	type: "p" | "n" | "b" | "r" | "q" | "k" 
};

export type ChessboardUIProps = {
	game: Chess;
	setGame: (g: Chess) => void;
	matchId: string;
	capturedPieces?: CapturedPieceLike[] | Piece[];
	finished?: { result: string; winner?: "white" | "black"; reason?: string } | null;
};

export type PlayerColor = "white" | "black";

export type GameFinishedState = {
	result: string;
	winner?: PlayerColor;
	reason?: string;
} | null;

export type DrawOffer = {
	fromName?: string;
} | null;

export interface ICustomSquareStyles {
	[key: string]: {
		background: string;
	};
}

export interface ICustomPieces {
	[key: string]: ({ style }: { style: CSSProperties }) => React.JSX.Element;
}

export type PlayerInfo = {
	id: string;
	name?: string;
	username?: string;
	color: PlayerColor;
};

export type MatchData = {
	id: string;
	players?: PlayerInfo[];
};

export type PlayerCardProps = {
	name?: string;
	color: PlayerColor;
	active: boolean;
	capturedByOpp: Piece[];
	isOpponent: boolean;
};

export type MatchHeaderProps = {
	game: Chess;
	myTurn: boolean;
	matchId: string;
	onOfferDraw: () => void;
	onResign: () => void;
};

export type GameBoardProps = {
	game: Chess;
	myColor: PlayerColor | null;
	myTurn: boolean;
	selectedSquare: Square | null;
	boardSidePx: number;
	squareStyles: ICustomSquareStyles;
	onSquareClick: (square: Square) => void;
	containerRef: React.RefObject<HTMLDivElement | null>;
};

export type GameDialogsProps = {
	drawOffer: DrawOffer;
	gameOverOpen: boolean;
	finished: GameFinishedState;
	myColor: PlayerColor | null;
	game: Chess;
	matchId: string;
	onDrawOfferClose: () => void;
	onGameOverClose: () => void;
	onDrawResponse: (accept: boolean) => void;
};