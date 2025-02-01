"use client";

import React, { useEffect, useState } from "react";
import { CSSProperties } from "react";
import { Chess, Piece, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import * as PieceIcons from "@/app/global-components/piece_icons/piece_icons";
import { JSX } from "@emotion/react/jsx-runtime";
import Grid from "@mui/material/Grid2";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { addEventHandler, subscribe, unsubscribeComponent } from "@/app/store/client_socket_slice";

const validSquaresColor = "radial-gradient(circle, rgb(0, 255, 0) 45%, transparent 45%)";
const activeSquareColor = "radial-gradient(circle,  transparent 20%, rgb(113, 113, 238) 85%)";

type Props = {};

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

export default ChessboardAuto;
