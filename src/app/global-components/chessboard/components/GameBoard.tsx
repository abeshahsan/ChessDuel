import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { GameBoardProps } from "./types";
import { pieceIcons } from "./utils";

/**
 * GameBoard Component
 * Displays the chess board with turn indicator and game status
 * Following Single Responsibility Principle - only handles board display and interaction
 */
export const GameBoard: React.FC<GameBoardProps> = ({
	game,
	myColor,
	myTurn,
	selectedSquare,
	boardSidePx,
	squareStyles,
	onSquareClick,
	containerRef,
}) => {
	const theme = useTheme();

	const showGameMessage = (): string => {
		if (game.isCheckmate()) return "Checkmate — game over";
		if (game.isCheck()) return "Check!";
		if (game.isDraw()) return "Draw";
		return "Game in progress";
	};

	return (
		<Box
			sx={{
				flex: "0 1 auto",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
				width: { xs: "100%", md: boardSidePx + 60 },
				backgroundColor: theme.palette.background.paper,
				borderRadius: theme.spacing(2.5),
				padding: theme.spacing(3),
				boxShadow: theme.shadows[3],
				border: `1px solid ${theme.palette.divider}`,
			}}
		>
			{/* Turn indicator above board */}
			<Box
				display='flex'
				alignItems='center'
				gap={2}
				justifyContent='center'
				width='100%'
				sx={{
					padding: theme.spacing(1.5, 2.5),
					backgroundColor: myTurn ? theme.palette.success.main : theme.palette.action.disabled,
					borderRadius: theme.spacing(1.5),
					color: myTurn ? theme.palette.success.contrastText : theme.palette.text.secondary,
					boxShadow: theme.shadows[1],
				}}
			>
				<Typography sx={{ fontWeight: 700, fontSize: { xs: 14, md: 16 } }}>
					{myTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
				</Typography>
				<Box
					sx={{
						width: 8,
						height: 8,
						borderRadius: "50%",
						backgroundColor: myTurn ? theme.palette.success.contrastText : theme.palette.text.disabled,
						opacity: 0.8,
						animation: myTurn ? "pulse 1.5s infinite" : "none",
					}}
				/>
			</Box>

			{/* Chessboard */}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
				}}
			>
				<div
					style={{
						boxShadow: theme.shadows[6],
						borderRadius: theme.spacing(2),
						overflow: "hidden",
						border: `2px solid ${theme.palette.divider}`,
					}}
				>
					<Chessboard
						id='ChessboardWithEvents'
						customPieces={pieceIcons}
						position={game.fen()}
						boardOrientation={myColor === "black" ? "black" : "white"}
						onSquareClick={onSquareClick}
						customSquareStyles={squareStyles}
						arePiecesDraggable={false}
						boardWidth={Math.max(280, boardSidePx)}
						customBoardStyle={{
							borderRadius: theme.spacing(1.5),
						}}
						customDarkSquareStyle={{ backgroundColor: "#8b4513" }}
						customLightSquareStyle={{ backgroundColor: "#deb887" }}
					/>
				</div>
			</div>

			{/* Game status message */}
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				width='100%'
				sx={{
					padding: theme.spacing(1, 2),
					backgroundColor: game.isCheck() ? theme.palette.warning.light : theme.palette.action.hover,
					borderRadius: theme.spacing(1.25),
					border: game.isCheck()
						? `1px solid ${theme.palette.warning.main}`
						: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Typography
					variant='subtitle2'
					sx={{
						color: game.isCheck() ? theme.palette.warning.main : theme.palette.text.secondary,
						fontWeight: 700,
						fontSize: "14px",
						letterSpacing: "0.5px",
					}}
				>
					{showGameMessage()}
				</Typography>
			</Box>
		</Box>
	);
};
