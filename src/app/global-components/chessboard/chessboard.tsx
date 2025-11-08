"use client";

import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
	ChessboardUIProps,
	MatchHeader,
	PlayerCard,
	GameBoard,
	GameDialogs,
	usePlayerInfo,
	useGameTurn,
	useBoardSize,
	useDrawOffer,
	useGameOver,
	useChessSquareStyles,
	useChessSquareClick,
	getPlayerName,
	normalizeCapturedPieces,
} from "./components";

/**
 * ChessboardUI Component
 * Main orchestrator component that manages the chess game interface
 * Following SOLID principles - delegates specific responsibilities to child components
 */
const ChessboardUI: React.FC<ChessboardUIProps> = ({
	game,
	setGame,
	matchId,
	capturedPieces = [],
	finished,
}) => {
	const theme = useTheme();
	const socket = useSelector((state: RootState) => state.clientSocket.socket);

	// Extract player and match information
	const { myColor, match } = usePlayerInfo();

	// Extract game turn logic
	const { myTurn } = useGameTurn(myColor, game);

	// Extract board sizing logic
	const { containerRef, boardSidePx } = useBoardSize();

	// Extract draw offer logic
	const { drawOffer, setDrawOffer, respondToDraw } = useDrawOffer(matchId, match);

	// Extract game over logic
	const { gameOverOpen, setGameOverOpen } = useGameOver(game, finished);

	// Extract square click logic
	const { selectedSquare, setSelectedSquare, onSquareClick } = useChessSquareClick(
		myTurn,
		myColor,
		game,
		matchId,
		match
	);

	// Extract square styles logic
	const { squareStyles } = useChessSquareStyles(selectedSquare, game, myTurn);

	// Normalize captured pieces
	const normalizedCaptured = normalizeCapturedPieces(capturedPieces);

	// Handle game actions
	const handleOfferDraw = () => {
		socket?.emit("offer-draw", matchId);
	};

	const handleResign = () => {
		socket?.emit("resign", matchId);
	};

	const handleDrawResponse = (accept: boolean) => {
		respondToDraw(accept);
	};

	const handleDrawOfferClose = () => {
		setDrawOffer(null);
	};

	const handleGameOverClose = () => {
		setGameOverOpen(false);
	};

	return (
		<div
			ref={containerRef}
			style={{
				width: "100%",
				height: "100%",
				padding: theme.spacing(2),
				boxSizing: "border-box",
				display: "flex",
				flexDirection: "column",
				gap: theme.spacing(2),
				backgroundColor: theme.palette.background.default,
				minHeight: "100vh",
			}}
		>
			{/* Match Header */}
			<MatchHeader
				game={game}
				myTurn={myTurn}
				matchId={matchId}
				onOfferDraw={handleOfferDraw}
				onResign={handleResign}
			/>

			{/* Main Game Layout */}
			<Box
				display="flex"
				gap={3}
				style={{
					width: "100%",
					flex: 1,
					minHeight: 400,
					alignItems: "stretch",
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "center",
				}}
			>
				{/* Opponent Player Card */}
				<Box
					sx={{
						minWidth: { xs: "100%", md: 240 },
						maxWidth: { xs: "100%", md: 280 },
						display: "flex",
						flexDirection: "column",
						gap: 2,
						alignItems: "stretch",
					}}
				>
					<PlayerCard
						name={getPlayerName(match, myColor === "white" ? "black" : "white")}
						color={myColor === "white" ? "black" : "white"}
						active={game.turn() === (myColor === "white" ? "b" : "w")}
						capturedByOpp={normalizedCaptured.filter(
							(p) => p.color === (myColor === "white" ? "w" : "b")
						)}
						isOpponent={true}
					/>
				</Box>

				{/* Game Board */}
				<GameBoard
					game={game}
					myColor={myColor}
					myTurn={myTurn}
					selectedSquare={selectedSquare}
					boardSidePx={boardSidePx}
					squareStyles={squareStyles}
					onSquareClick={onSquareClick}
					containerRef={containerRef}
				/>

				{/* My Player Card */}
				<Box
					sx={{
						minWidth: { xs: "100%", md: 240 },
						maxWidth: { xs: "100%", md: 280 },
						display: "flex",
						flexDirection: "column",
						gap: 2,
						alignItems: "stretch",
					}}
				>
					<PlayerCard
						name={getPlayerName(match, myColor || "white")}
						color={myColor || "white"}
						active={game.turn() === (myColor === "white" ? "w" : "b")}
						capturedByOpp={normalizedCaptured.filter(
							(p) => p.color === (myColor === "white" ? "b" : "w")
						)}
						isOpponent={false}
					/>
				</Box>
			</Box>

			{/* Game Dialogs */}
			<GameDialogs
				drawOffer={drawOffer}
				gameOverOpen={gameOverOpen}
				finished={finished || null}
				myColor={myColor}
				game={game}
				matchId={matchId}
				onDrawOfferClose={handleDrawOfferClose}
				onGameOverClose={handleGameOverClose}
				onDrawResponse={handleDrawResponse}
			/>
		</div>
	);
};

export default ChessboardUI;