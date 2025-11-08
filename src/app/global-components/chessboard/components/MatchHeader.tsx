import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FlagIcon from "@mui/icons-material/Flag";
import { MatchHeaderProps } from "./types";

/**
 * MatchHeader Component
 * Displays live match status, game state indicators, and action buttons
 * Following Single Responsibility Principle - only handles match header UI
 */
export const MatchHeader: React.FC<MatchHeaderProps> = ({
	game,
	myTurn,
	matchId,
	onOfferDraw,
	onResign
}) => {
	const theme = useTheme();

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			gap={2}
			sx={{
				width: "100%",
				padding: theme.spacing(1.5, 2.5),
				backgroundColor: theme.palette.background.paper,
				borderRadius: theme.spacing(2),
				boxShadow: theme.shadows[2],
				border: `1px solid ${theme.palette.divider}`,
			}}
		>
			<Box display="flex" alignItems="center" gap={3}>
				{/* Live Match Indicator */}
				<Box
					sx={{
						padding: theme.spacing(1, 2),
						borderRadius: theme.spacing(1.5),
						backgroundColor: theme.palette.primary.main,
						color: theme.palette.primary.contrastText,
						boxShadow: theme.shadows[1],
					}}
				>
					<Box display="flex" gap={1.5} alignItems="center">
						<SportsEsportsIcon fontSize="small" />
						<Typography
							variant="subtitle2"
							sx={{ fontWeight: 700, letterSpacing: "0.5px" }}
						>
							LIVE MATCH
						</Typography>
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								backgroundColor: theme.palette.success.main,
								animation: "pulse 2s infinite",
								"@keyframes pulse": {
									"0%, 100%": { opacity: 1 },
									"50%": { opacity: 0.5 },
								},
							}}
						/>
					</Box>
				</Box>

				{/* Game Status Indicators */}
				{game.isCheckmate() ? (
					<Box
						sx={{
							padding: theme.spacing(0.75, 1.5),
							borderRadius: theme.spacing(1),
							backgroundColor: theme.palette.error.main,
							color: theme.palette.error.contrastText,
							display: "flex",
							alignItems: "center",
							gap: 1,
							boxShadow: theme.shadows[1],
						}}
					>
						<FlagIcon fontSize="small" />
						<Typography
							variant="caption"
							sx={{ fontWeight: 700, fontSize: "12px" }}
						>
							CHECKMATE
						</Typography>
					</Box>
				) : game.isCheck() ? (
					<Box
						sx={{
							padding: theme.spacing(0.75, 1.5),
							borderRadius: theme.spacing(1),
							backgroundColor: theme.palette.warning.main,
							color: theme.palette.warning.contrastText,
							display: "flex",
							alignItems: "center",
							gap: 1,
							boxShadow: theme.shadows[1],
						}}
					>
						<InfoOutlinedIcon fontSize="small" />
						<Typography
							variant="caption"
							sx={{ fontWeight: 700, fontSize: "12px" }}
						>
							CHECK
						</Typography>
					</Box>
				) : null}
			</Box>

			{/* Action Buttons */}
			<Box display="flex" gap={1.5} alignItems="center">
				<Button
					variant="outlined"
					size="small"
					onClick={onOfferDraw}
					disabled={!myTurn}
					sx={{
						borderRadius: theme.spacing(1.25),
						fontWeight: 600,
						textTransform: "none",
						padding: theme.spacing(0.75, 2),
					}}
				>
					Offer Draw
				</Button>
				<Button
					variant="contained"
					color="error"
					size="small"
					onClick={onResign}
					sx={{
						borderRadius: theme.spacing(1.25),
						fontWeight: 600,
						textTransform: "none",
						padding: theme.spacing(0.75, 2),
					}}
				>
					Resign
				</Button>
			</Box>
		</Box>
	);
};