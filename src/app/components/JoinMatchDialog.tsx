"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Typography,
	IconButton,
	Alert,
	InputAdornment,
} from "@mui/material";
import {
	Close as CloseIcon,
	ContentPaste as PasteIcon,
	Link as LinkIcon,
} from "@mui/icons-material";

interface JoinMatchDialogProps {
	open: boolean;
	onClose: () => void;
}

const JoinMatchDialog: React.FC<JoinMatchDialogProps> = ({ open, onClose }) => {
	const [matchId, setMatchId] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleClose = () => {
		setMatchId("");
		setError("");
		setIsLoading(false);
		onClose();
	};

	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			
			// Try to extract match ID from various URL formats
			const urlPatterns = [
				/\/match\/join\/([a-zA-Z0-9-_]+)/,  // /match/join/abc123
				/match\/join\/([a-zA-Z0-9-_]+)/,   // match/join/abc123
				/join\/([a-zA-Z0-9-_]+)/,          // join/abc123
			];
			
			let extractedId = null;
			for (const pattern of urlPatterns) {
				const match = text.match(pattern);
				if (match) {
					extractedId = match[1];
					break;
				}
			}
			
			if (extractedId) {
				setMatchId(extractedId);
				setError("");
			} else if (text.trim()) {
				// If it's not a URL, assume it's just the match ID
				const cleanId = text.trim().replace(/[^a-zA-Z0-9-_]/g, '');
				if (cleanId) {
					setMatchId(cleanId);
					setError("");
				} else {
					setError("No valid match ID found in clipboard");
				}
			} else {
				setError("No valid match ID found in clipboard");
			}
		} catch (err) {
			setError("Failed to read from clipboard. You may need to allow clipboard access.");
		}
	};

	const validateMatchId = (id: string): boolean => {
		// Basic validation - match ID should not be empty and should be reasonable length
		if (!id.trim()) {
			setError("Please enter a match ID");
			return false;
		}
		
		if (id.length < 3) {
			setError("Match ID seems too short");
			return false;
		}
		
		if (id.length > 50) {
			setError("Match ID seems too long");
			return false;
		}
		
		// Check for valid characters (alphanumeric, hyphens, underscores)
		const validPattern = /^[a-zA-Z0-9-_]+$/;
		if (!validPattern.test(id)) {
			setError("Match ID contains invalid characters");
			return false;
		}
		
		return true;
	};

	const handleJoinMatch = async () => {
		if (!validateMatchId(matchId)) {
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			// Navigate to the match join page
			router.push(`/match/join/${matchId.trim()}`);
			handleClose();
		} catch (err) {
			setError("Failed to join match. Please try again.");
			setIsLoading(false);
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			handleJoinMatch();
		}
	};

	return (
		<Dialog 
			open={open} 
			onClose={handleClose} 
			maxWidth="sm" 
			fullWidth
			disableScrollLock={true} // Prevent scrollbar hiding
		>
			<DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<LinkIcon color="primary" />
					<Typography variant="h6">Join Match</Typography>
				</Box>
				<IconButton onClick={handleClose} size="small">
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					Enter a match ID or paste a match link to join an existing game.
				</Typography>

				<TextField
					fullWidth
					label="Match ID or Link"
					variant="outlined"
					placeholder="e.g., match-abc123 or full URL"
					value={matchId}
					onChange={(e) => {
						setMatchId(e.target.value);
						setError("");
					}}
					onKeyPress={handleKeyPress}
					disabled={isLoading}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={handlePaste}
									edge="end"
									disabled={isLoading}
									title="Paste from clipboard"
								>
									<PasteIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
					sx={{ mb: 2 }}
				/>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
					<Typography variant="caption" color="text.secondary">
						<strong>Tips:</strong>
					</Typography>
					<Typography variant="caption" color="text.secondary" component="div">
						• You can paste a full match URL (e.g., /match/join/abc123)
					</Typography>
					<Typography variant="caption" color="text.secondary" component="div">
						• Or just enter the match ID directly (e.g., abc123)
					</Typography>
					<Typography variant="caption" color="text.secondary" component="div">
						• You must be signed in to join a match
					</Typography>
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={handleClose} disabled={isLoading}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleJoinMatch}
					disabled={!matchId.trim() || isLoading}
				>
					{isLoading ? "Joining..." : "Join Match"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default JoinMatchDialog;