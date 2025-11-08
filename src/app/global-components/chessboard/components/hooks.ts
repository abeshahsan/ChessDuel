import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Square } from "chess.js";
import { RootState } from "@/app/store";
import { PlayerColor, MatchData, DrawOffer, ICustomSquareStyles } from "./types";
import { hexToRgba } from "./utils";

/**
 * Hook to manage player information and match state
 */
export const usePlayerInfo = () => {
	const { data: session } = useSession();
	const match = useSelector((state: RootState) => state.match) as MatchData;
	
	const myColor = useMemo(() => {
		if (!session?.user?.id) return null as PlayerColor | null;
		const me = match.players?.find((p) => p.id === session.user.id);
		return me?.color ?? null;
	}, [session?.user?.id, match.players]);

	return { myColor, match, session };
};

/**
 * Hook to manage chess game turn logic
 */
export const useGameTurn = (myColor: PlayerColor | null, game: any) => {
	const myTurn = useMemo(() => {
		if (!myColor) return false;
		const turn = game.turn(); // 'w' | 'b'
		return (myColor === "white" && turn === "w") || (myColor === "black" && turn === "b");
	}, [myColor, game]);

	return { myTurn };
};

/**
 * Hook to manage responsive board sizing
 */
export const useBoardSize = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [boardSidePx, setBoardSidePx] = useState<number>(480);

	useEffect(() => {
		if (!containerRef.current) return;
		const el = containerRef.current;
		const ro = new ResizeObserver(() => {
			const paddingBuffer = 28; // spacing for top/bottom bars
			const width = el.clientWidth;
			const height = el.clientHeight;
			// on wide screens use min of (height - UI rows) and width * 0.6
			const maxByHeight = Math.max(240, height - 220 - paddingBuffer);
			const maxByWidth = Math.max(240, Math.floor(width * 0.6));
			const size = Math.min(maxByHeight, maxByWidth);
			setBoardSidePx(size);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return { containerRef, boardSidePx };
};

/**
 * Hook to manage draw offers
 */
export const useDrawOffer = (matchId: string, match: MatchData) => {
	const [drawOffer, setDrawOffer] = useState<DrawOffer>(null);
	const socket = useSelector((state: RootState) => state.clientSocket.socket);

	useEffect(() => {
		if (!socket) return;
		
		const onOffer = (payload: { matchId: string; from: string; fromName?: string }) => {
			if (payload.matchId !== (matchId || match.id)) return;
			setDrawOffer({ fromName: payload.fromName });
		};
		
		const onDeclined = () => {
			// keep minimal: ignore for now (could show snackbar)
		};
		
		socket.on("draw-offer", onOffer);
		socket.on("draw-declined", onDeclined);
		
		return () => {
			socket.off("draw-offer", onOffer);
			socket.off("draw-declined", onDeclined);
		};
	}, [socket, matchId, match.id]);

	const respondToDraw = (accept: boolean) => {
		socket?.emit("respond-draw", matchId, accept);
		setDrawOffer(null);
	};

	return { drawOffer, setDrawOffer, respondToDraw };
};

/**
 * Hook to manage game over state
 */
export const useGameOver = (game: any, finished: any) => {
	const [gameOverOpen, setGameOverOpen] = useState(false);

	useEffect(() => {
		if (game.isGameOver() || !!finished) setGameOverOpen(true);
	}, [game, finished]);

	return { gameOverOpen, setGameOverOpen };
};

/**
 * Hook to manage chess square selection and highlighting
 */
export const useChessSquareStyles = (selectedSquare: Square | null, game: any, myTurn: boolean) => {
	const theme = useTheme();

	const validMoves = useMemo(() => {
		if (!selectedSquare || !myTurn) return {};
		const validSquaresColor = `radial-gradient(circle, ${hexToRgba(
			theme.palette.success.main,
			0.4
		)} 45%, transparent 45%)`;
		const moves = game.moves({ square: selectedSquare, verbose: true });
		return moves.reduce((acc: ICustomSquareStyles, move: any) => {
			acc[move.to] = {
				background: validSquaresColor,
			};
			return acc;
		}, {} as ICustomSquareStyles);
	}, [selectedSquare, game, myTurn, theme]);

	const squareStyles = useMemo(() => {
		const styles: ICustomSquareStyles = {};
		const activeSquareColor = `radial-gradient(circle, ${hexToRgba(
			theme.palette.primary.main,
			0.3
		)} 20%, ${hexToRgba(theme.palette.primary.main, 0.5)} 85%)`;
		if (selectedSquare) styles[selectedSquare] = { background: activeSquareColor };
		return { ...styles, ...validMoves };
	}, [selectedSquare, validMoves, theme]);

	return { squareStyles };
};

/**
 * Hook to manage chess square click logic
 */
export const useChessSquareClick = (
	myTurn: boolean,
	myColor: PlayerColor | null,
	game: any,
	matchId: string,
	match: MatchData
) => {
	const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
	const socket = useSelector((state: RootState) => state.clientSocket.socket);

	const onSquareClick = (square: Square) => {
		// Not my turn - clear selection and ignore clicks
		if (!myTurn) {
			setSelectedSquare(null);
			return;
		}

		// First click - select piece if it's mine
		if (!selectedSquare) {
			const piece = game.get(square);
			const pieceColor = piece?.color === "w" ? "white" : "black";
			if (piece && pieceColor === myColor) {
				setSelectedSquare(square);
			}
			return;
		}

		// Second click
		if (selectedSquare) {
			if (square === selectedSquare) {
				setSelectedSquare(null);
				return;
			}
			const idToUse = matchId || match.id;
			if (idToUse) {
				socket?.emit("chess-move", idToUse, {
					from: selectedSquare,
					to: square,
					promotion: "q",
				});
			}
			setSelectedSquare(null);
		}
	};

	return { selectedSquare, setSelectedSquare, onSquareClick };
};