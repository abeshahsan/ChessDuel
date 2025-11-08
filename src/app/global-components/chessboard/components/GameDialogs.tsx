import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GameDialogsProps } from "./types";

/**
 * GameDialogs Component
 * Handles both draw offer and game over dialogs
 * Following Single Responsibility Principle - only handles dialog interactions
 */
export const GameDialogs: React.FC<GameDialogsProps> = ({
	drawOffer,
	gameOverOpen,
	finished,
	myColor,
	game,
	matchId,
	onDrawOfferClose,
	onGameOverClose,
	onDrawResponse,
}) => {
	const theme = useTheme();

	return (
		<>
			{/* Draw Offer Dialog */}
			<Dialog
				open={!!drawOffer}
				onClose={onDrawOfferClose}
				PaperProps={{
					sx: {
						borderRadius: theme.spacing(2),
						padding: theme.spacing(1),
						backgroundColor: theme.palette.background.paper,
						boxShadow: theme.shadows[3],
						border: `1px solid ${theme.palette.divider}`,
					},
				}}
			>
				<DialogTitle
					sx={{
						fontSize: "18px",
						fontWeight: 700,
						color: theme.palette.text.primary,
						textAlign: "center",
						padding: theme.spacing(2.5, 3, 2),
					}}
				>
					🤝 Draw Offer
				</DialogTitle>
				<DialogContent sx={{ padding: theme.spacing(0, 3, 2.5) }}>
					<Typography
						sx={{
							textAlign: "center",
							fontSize: "14px",
							color: theme.palette.text.secondary,
							lineHeight: 1.6,
						}}
					>
						{drawOffer?.fromName
							? `${drawOffer.fromName} offered a draw.`
							: "Your opponent offered a draw."}
						<br />
						<span
							style={{
								fontSize: "12px",
								color: theme.palette.text.disabled,
							}}
						>
							Do you want to accept and end the game in a draw?
						</span>
					</Typography>
				</DialogContent>
				<DialogActions
					sx={{
						padding: theme.spacing(0, 3, 2.5),
						gap: theme.spacing(1),
						justifyContent: "center",
					}}
				>
					<Button
						onClick={() => onDrawResponse(false)}
						variant="outlined"
						sx={{
							borderRadius: theme.spacing(1.25),
							padding: theme.spacing(1, 2.5),
							fontWeight: 600,
							textTransform: "none",
						}}
					>
						Decline
					</Button>
					<Button
						variant="contained"
						onClick={() => onDrawResponse(true)}
						sx={{
							borderRadius: theme.spacing(1.25),
							padding: theme.spacing(1, 2.5),
							fontWeight: 600,
							textTransform: "none",
							boxShadow: theme.shadows[2],
						}}
					>
						Accept Draw
					</Button>
				</DialogActions>
			</Dialog>

			{/* Game Over Dialog */}
			<Dialog
				open={gameOverOpen}
				onClose={onGameOverClose}
				PaperProps={{
					sx: {
						borderRadius: theme.spacing(2),
						padding: theme.spacing(1),
						backgroundColor: theme.palette.background.paper,
						boxShadow: theme.shadows[3],
						border: `1px solid ${theme.palette.divider}`,
						textAlign: "center",
					},
				}}
			>
				<DialogTitle
					sx={{
						fontSize: "20px",
						fontWeight: 700,
						color: theme.palette.text.primary,
						textAlign: "center",
						padding: theme.spacing(2.5, 3, 2),
					}}
				>
					🏁 Game Over
				</DialogTitle>
				<DialogContent sx={{ padding: theme.spacing(0, 3, 2.5) }}>
					<Typography
						sx={{
							textAlign: "center",
							fontSize: "16px",
							fontWeight: 600,
							color: theme.palette.text.secondary,
							marginBottom: theme.spacing(1),
						}}
					>
						{finished?.result === "checkmate"
							? "🎯 Checkmate!"
							: finished?.result === "draw"
							? "🤝 Draw"
							: finished?.result === "resignation"
							? "🏳️ Resignation"
							: game.isCheckmate()
							? "🎯 Checkmate!"
							: game.isDraw()
							? "🤝 Draw"
							: "Game Over"}
					</Typography>
					{finished?.winner && (
						<Typography
							sx={{
								fontSize: "14px",
								color: theme.palette.text.disabled,
							}}
						>
							{finished.winner === myColor ? "You won!" : "Opponent won"}
						</Typography>
					)}
				</DialogContent>
				<DialogActions
					sx={{
						padding: theme.spacing(0, 3, 2.5),
						justifyContent: "center",
					}}
				>
					<Button
						onClick={onGameOverClose}
						variant="contained"
						sx={{
							borderRadius: theme.spacing(1.25),
							padding: theme.spacing(1.25, 3),
							fontWeight: 600,
							textTransform: "none",
							boxShadow: theme.shadows[2],
						}}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};