"use client";

import React, { useEffect, useState } from "react";
import { CSSProperties } from "react";
import { Chess, Piece, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import * as PieceIcons from "@/app/piece_icons/piece_icons";
import { JSX } from "@emotion/react/jsx-runtime";
import Grid from "@mui/material/Grid2";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import useChessboardEffect from "@/app/match/hooks/useChessboardEffect";
import { subscribe } from "@/app/store/client_socket_slice";

type ChessboardUIProps = {
	game: Chess;
	setGame: any;
};

const ChessboardUI = ({ game, setGame }: ChessboardUIProps) => {
	const [validSquares, setValidSquares] = useState<Square[]>([]);
	const [activeSquare, setActiveSquare] = useState<Square | null>(null);
	const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);

	let customSquareStyles: ICustomSquareStyles = {};
	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const match = useSelector((state: RootState) => state.match);
	const dispatch = useDispatch();

	updateSquareStyles();

	return (
		<div className='container mx-auto w-full h-screen'>
			<Button
				onClick={() => {
					socket?.emit("message", "Hello from client");
				}}
			>
				Send Message to Server
			</Button>
			<Chessboard
				id='ChessboardWithEvents'
				customPieces={pieceIcons}
				position={game.fen()}
				onSquareClick={onSquareClick}
				customSquareStyles={customSquareStyles}
				arePiecesDraggable={false}
			/>
			<div className='mt-1 mb-1'>
				<CapturedPieces
					capturedPieces={capturedPieces}
					color='w'
				/>
				<CapturedPieces
					capturedPieces={capturedPieces}
					color='b'
				/>
			</div>
			<Grid
				sx={{
					minHeight: { xs: "20px", sm: "30px", md: "40px" },
					backgroundColor: "white",
					border: "1px solid black",
					borderRadius: { xs: "2px", sm: "3px", md: "5px" },
					padding: { xs: "1px", sm: "1px", md: "1px" },
					marginTop: "2px",
					marginBottom: "2px",
				}}
				container
				columns={4}
			>
				<Grid
					size={1}
					sx={{
						backgroundColor: "#e0d1ad",
						border: "1px solid black",
						borderRadius: { xs: "2px", sm: "3px", md: "5px" },
					}}
				>
					<Box
						display='flex'
						alignItems='center'
						justifyContent='center'
						height='100%'
					>
						<Typography
							align='center'
							sx={{
								fontWeight: "bold",
								fontSize: { xs: "14px", sm: "16px", md: "18px" },
								color: "black",
								opacity: game.turn() === "b" ? 1 : 0.5,
							}}
						>
							Black's Turn
						</Typography>
					</Box>
				</Grid>
				<Grid
					size={2}
					sx={{
						backgroundColor: "#e0d1ad",
						border: "1px solid black",
						borderRadius: { xs: "2px", sm: "3px", md: "5px" },
					}}
				>
					<Box
						display='flex'
						alignItems='center'
						justifyContent='center'
						height='100%'
					>
						<Typography
							variant='h6'
							align='center'
							sx={{ fontWeight: "bold", color: "#000" }}
						>
							{showGameMessage()}
						</Typography>
					</Box>
				</Grid>
				<Grid
					size={1}
					sx={{
						backgroundColor: "#e0d1ad",
						border: "1px solid black",
						borderRadius: { xs: "2px", sm: "3px", md: "5px" },
					}}
				>
					<Box
						display='flex'
						alignItems='center'
						justifyContent='center'
						height='100%'
					>
						<Typography
							align='center'
							sx={{
								fontWeight: "bold",
								fontSize: { xs: "14px", sm: "16px", md: "18px" },
								color: "black",
								opacity: game.turn() === "w" ? 1 : 0.5,
							}}
						>
							White's Turn
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</div>
	);

	function showGameMessage() {
		if (game.isCheckmate()) {
			return "Check Mate";
		}
		if (game.isCheck()) {
			return "Check";
		}
		return "";
	}

	function onSquareClick(square: Square) {
		if (activeSquare) {
			try {
				const capturedPiece = game.get(square);

				game.move({
					from: activeSquare,
					to: square,
					promotion: "q",
				});

				socket?.emit("chess-move", match.id, { from: activeSquare, to: square, promotion: "q" });

				if (capturedPiece) {
					setCapturedPieces(() => {
						return [...capturedPieces, capturedPiece];
					});
				}

				setGame(() => {
					return new Chess(game.fen());
				});
				setActiveSquare(null);
				setValidSquares([]);
			} catch (error) {
				setActiveSquare(null);
				setValidSquares([]);
			}
		} else {
			if (hasPiece(square) && hasTurn(square)) {
				setActiveSquare(square);
				setValidSquares(game.moves({ square: square }) as Square[]);
			}
		}
	}

	function hasPiece(square: Square): boolean {
		return game.get(square) !== null;
	}

	function hasTurn(square: Square): boolean {
		return game.get(square).color === game.turn();
	}

	function updateSquareStyles() {
		validSquares.forEach((square: Square) => {
			square = square
				.toString()
				.replace(/[x+]|=./gi, "")
				.slice(-2) as Square;

			customSquareStyles[square] = {
				background: validSquaresColor,
			};
		});
		if (activeSquare) {
			customSquareStyles[activeSquare] = {
				background: activeSquareColor,
			};
		}
	}
};

const CapturedPieces = ({ capturedPieces, color }: { capturedPieces: Piece[]; color: string }) => {
	if (color === "w") {
		capturedPieces = capturedPieces.filter((piece: Piece) => piece.color === "w");
	} else {
		capturedPieces = capturedPieces.filter((piece: Piece) => piece.color === "b");
	}
	return (
		<>
			<Grid
				sx={{
					backgroundColor: "#e0d1ad",
					border: "1px solid black",
					borderRadius: { xs: "2px", sm: "3px", md: "5px" },
					padding: { xs: "1px", sm: "3px", md: "5px" },
				}}
				container
				columns={16}
			>
				{capturedPieces.length > 0 ? (
					capturedPieces.map((piece: Piece, index: number) => {
						let PieceIcon: ({ style }: { style: CSSProperties }) => JSX.Element;

						PieceIcon = pieceIcons[getPieceIocnsKey(piece.color, piece.type)] as ({
							style,
						}: {
							style: CSSProperties;
						}) => JSX.Element;
						const customStyle: CSSProperties = {
							aspectRatio: "1",
							width: "60%",
						};
						return (
							<Grid
								maxHeight={{ md: "18px", sm: "12px", xs: "7px" }}
								key={index}
								size={1}
							>
								<PieceIcon style={customStyle} />
							</Grid>
						);
					})
				) : (
					<Grid
						maxHeight={{ md: "15px", sm: "10px", xs: "5px" }}
						size={1}
						sx={{ visibility: "hidden" }}
					>
						Placeholder
					</Grid>
				)}
			</Grid>
		</>
	);
};

const validSquaresColor = "radial-gradient(circle, rgb(0, 255, 0) 45%, transparent 45%)";
const activeSquareColor = "radial-gradient(circle,  transparent 20%, rgb(113, 113, 238) 85%)";

interface ICustomSquareStyles {
	[key: string]: {
		background: string;
	};
}

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

export default ChessboardUI;
