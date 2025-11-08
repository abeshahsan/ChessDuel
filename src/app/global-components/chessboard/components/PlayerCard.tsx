import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Piece } from "chess.js";
import { PlayerCardProps } from "./types";
import { pieceIcons, getPieceIconsKey, calculateMaterialAdvantage } from "./utils";

/**
 * PlayerCard Component
 * Displays player information, status, and captured pieces
 * Following Single Responsibility Principle - only handles player display
 */
export const PlayerCard: React.FC<PlayerCardProps> = ({
	name,
	color,
	active,
	capturedByOpp,
	isOpponent,
}) => {
	const theme = useTheme();
	const captureValue = calculateMaterialAdvantage(capturedByOpp);

	const isLightColor = color === "white";
	const cardBg =
		theme.palette.mode === "dark"
			? isLightColor
				? theme.palette.grey[800]
				: theme.palette.grey[900]
			: isLightColor
			? theme.palette.grey[50]
			: theme.palette.grey[100];

	return (
		<Box
			sx={{
				padding: theme.spacing(2.5),
				borderRadius: theme.spacing(2),
				backgroundColor: cardBg,
				color: theme.palette.text.primary,
				boxShadow: active ? `0 0 0 2px ${theme.palette.primary.main}` : theme.shadows[1],
				border: `1px solid ${theme.palette.divider}`,
				position: "relative",
				overflow: "hidden",
				transition: theme.transitions.create(["box-shadow", "transform"], {
					duration: theme.transitions.duration.short,
				}),
				"&:hover": {
					transform: "translateY(-1px)",
					boxShadow: theme.shadows[2],
				},
			}}
		>
			{/* Active indicator */}
			{active && (
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: "3px",
						backgroundColor: theme.palette.primary.main,
						animation: "pulse 2s infinite",
					}}
				/>
			)}

			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				mb={2}
			>
				<Box display="flex" gap={1.5} alignItems="center">
					{/* Player avatar */}
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: theme.spacing(1.5),
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: theme.palette.background.paper,
							border: `2px solid ${theme.palette.divider}`,
							boxShadow: theme.shadows[1],
						}}
					>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 800,
								color: theme.palette.text.primary,
							}}
						>
							{color === "white" ? "♔" : "♚"}
						</Typography>
					</Box>

					<Box>
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "16px",
								mb: 0.5,
								color: theme.palette.text.primary,
							}}
						>
							{name || (color === "white" ? "White" : "Black")}
						</Typography>
						<Box display="flex" alignItems="center" gap={1}>
							<Box
								sx={{
									width: 8,
									height: 8,
									borderRadius: "50%",
									backgroundColor: active
										? theme.palette.success.main
										: theme.palette.action.disabled,
									animation: active ? "pulse 2s infinite" : "none",
								}}
							/>
							<Typography
								variant="caption"
								sx={{
									color: theme.palette.text.secondary,
									fontSize: "12px",
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "0.5px",
								}}
							>
								{active ? "Playing" : "Waiting"}
							</Typography>
						</Box>
					</Box>
				</Box>

				{/* Material advantage */}
				{captureValue > 0 && (
					<Box
						sx={{
							padding: theme.spacing(0.5, 1),
							borderRadius: theme.spacing(1),
							backgroundColor: theme.palette.success.main,
							color: theme.palette.success.contrastText,
							boxShadow: theme.shadows[1],
						}}
					>
						<Typography
							variant="caption"
							sx={{ fontWeight: 700, fontSize: "11px" }}
						>
							+{captureValue}
						</Typography>
					</Box>
				)}
			</Box>

			{/* Captured pieces display */}
			<Box>
				<Typography
					variant="body2"
					sx={{
						color: theme.palette.text.secondary,
						mb: 1,
						fontSize: "12px",
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						fontWeight: 600,
					}}
				>
					Captured ({capturedByOpp.length})
				</Typography>

				{capturedByOpp.length > 0 ? (
					<Box
						display="flex"
						gap={0.5}
						flexWrap="wrap"
						sx={{
							padding: theme.spacing(1),
							backgroundColor: theme.palette.action.hover,
							borderRadius: theme.spacing(1),
							border: `1px solid ${theme.palette.divider}`,
						}}
					>
						{capturedByOpp.slice(0, 8).map((piece, index) => {
							const Icon = pieceIcons[getPieceIconsKey(piece.color, piece.type)];
							return (
								<Box
									key={index}
									sx={{
										width: 24,
										height: 24,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: theme.palette.background.paper,
										borderRadius: theme.spacing(0.5),
										border: `1px solid ${theme.palette.divider}`,
									}}
								>
									<Icon style={{ width: "18px", height: "18px" }} />
								</Box>
							);
						})}
						{capturedByOpp.length > 8 && (
							<Box
								sx={{
									width: 24,
									height: 24,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: theme.palette.action.selected,
									borderRadius: theme.spacing(0.5),
								}}
							>
								<Typography
									variant="caption"
									sx={{
										fontSize: "10px",
										fontWeight: 700,
										color: theme.palette.text.primary,
									}}
								>
									+{capturedByOpp.length - 8}
								</Typography>
							</Box>
						)}
					</Box>
				) : (
					<Typography
						variant="caption"
						sx={{
							color: theme.palette.text.disabled,
							fontStyle: "italic",
							fontSize: "12px",
						}}
					>
						No captures yet
					</Typography>
				)}
			</Box>
		</Box>
	);
};