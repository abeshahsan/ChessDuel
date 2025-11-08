import React from "react";
import * as PieceIcons from "@/app/global-components/piece_icons/piece_icons";
import { ICustomPieces, PlayerColor, MatchData } from "./types";
import { CSSProperties } from "react";

/**
 * Converts a hex color to rgba format with specified alpha
 */
export function hexToRgba(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Gets the piece icon key for the piece icons mapping
 */
export const getPieceIconsKey = (color: string, type: string): string => {
	color = color.toLowerCase();
	type = type.toLowerCase();
	return color + type.toUpperCase();
};

/**
 * Get player's display name from match object safely
 */
export function getPlayerName(match: MatchData, color: PlayerColor): string | undefined {
	try {
		if (!match || !match.players) return undefined;
		const player = match.players.find((pl) => pl.color === color);
		return player?.name || player?.username || (color === "white" ? "White" : "Black");
	} catch {
		return color === "white" ? "White" : "Black";
	}
}

/**
 * Piece icons mapping for the chessboard
 */
export const pieceIcons: ICustomPieces = {
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

/**
 * Calculate material advantage value from captured pieces
 */
export function calculateMaterialAdvantage(capturedPieces: { type: string }[]): number {
	const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
	return capturedPieces.reduce((sum, piece) => {
		return sum + (values[piece.type as keyof typeof values] || 0);
	}, 0);
}

/**
 * Normalize captured pieces to ensure consistent format
 */
export function normalizeCapturedPieces(capturedPieces: any[]): any[] {
	return (capturedPieces || []).map((p: any) => {
		if (p?.type && p?.color) return p;
		// fallback if the object has similar shape
		return { type: p.type, color: p.color };
	});
}