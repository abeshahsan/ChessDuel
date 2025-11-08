"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Container, Typography, Button, Box, Paper, Grid, Card, CardContent, CardActions, Chip } from "@mui/material";
import {
	SportsEsports as NewMatchIcon,
	Group as JoinMatchIcon,
	Dashboard as DashboardIcon,
	PlayArrow as PlayIcon,
} from "@mui/icons-material";
import ChessboardAuto from "./global-components/chessboard/chessboard-auto";
import JoinMatchDialog from "./components/JoinMatchDialog";
import { selectUserProfile } from "./store/user_profile_slice";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const userProfile = useSelector(selectUserProfile);
	const [joinDialogOpen, setJoinDialogOpen] = useState(false);

	const handleNewMatch = () => {
		router.push("/match/new");
	};

	const handleJoinMatch = () => {
		setJoinDialogOpen(true);
	};

	const renderAuthenticatedContent = () => (
		<Container
			maxWidth='lg'
			sx={{ mt: 4, mb: 4 }}
		>
			<Box sx={{ textAlign: "center", mb: 4 }}>
				<Typography
					variant='h3'
					component='h1'
					gutterBottom
				>
					Welcome back, {userProfile?.ign || session?.user?.name?.split(" ")[0] || "Player"}!
				</Typography>
				<Typography
					variant='h6'
					color='text.secondary'
				>
					Ready for your next chess match?
				</Typography>
			</Box>

			<Grid
				container
				spacing={3}
				sx={{ mb: 4 }}
			>
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card
						elevation={3}
						sx={{ height: "100%" }}
					>
						<CardContent sx={{ textAlign: "center", p: 3 }}>
							<NewMatchIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
							<Typography
								variant='h5'
								component='h2'
								gutterBottom
							>
								Create New Match
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								Start a new game and invite friends to play
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: "center", pb: 2 }}>
							<Button
								variant='contained'
								size='large'
								startIcon={<PlayIcon />}
								onClick={handleNewMatch}
								sx={{ minWidth: 140 }}
							>
								New Game
							</Button>
						</CardActions>
					</Card>
				</Grid>

				<Grid
					item
					xs={12}
					md={4}
				>
					<Card
						elevation={3}
						sx={{ height: "100%" }}
					>
						<CardContent sx={{ textAlign: "center", p: 3 }}>
							<JoinMatchIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
							<Typography
								variant='h5'
								component='h2'
								gutterBottom
							>
								Join Match
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								Join an existing game with a match ID
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: "center", pb: 2 }}>
							<Button
								variant='outlined'
								size='large'
								startIcon={<JoinMatchIcon />}
								onClick={handleJoinMatch}
								sx={{ minWidth: 140 }}
							>
								Join Game
							</Button>
						</CardActions>
					</Card>
				</Grid>

				<Grid
					item
					xs={12}
					md={4}
				>
					<Card
						elevation={3}
						sx={{ height: "100%" }}
					>
						<CardContent sx={{ textAlign: "center", p: 3 }}>
							<DashboardIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
							<Typography
								variant='h5'
								component='h2'
								gutterBottom
							>
								Dashboard
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								View your match history and statistics
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: "center", pb: 2 }}>
							<Button
								variant='outlined'
								size='large'
								startIcon={<DashboardIcon />}
								onClick={() => router.push("/dashboard")}
								sx={{ minWidth: 140 }}
							>
								Dashboard
							</Button>
						</CardActions>
					</Card>
				</Grid>
			</Grid>

			<Paper
				elevation={2}
				sx={{ p: 2, textAlign: "center" }}
			>
				<Box sx={{ maxWidth: 600, mx: "auto" }}>
					<ChessboardAuto />
				</Box>
			</Paper>
		</Container>
	);

	const renderUnauthenticatedContent = () => (
		<Container
			maxWidth='lg'
			sx={{ mt: 4, mb: 4 }}
		>
			<Box sx={{ textAlign: "center", mb: 4 }}>
				<Typography
					variant='h3'
					component='h1'
					gutterBottom
				>
					Welcome to ChessDuel
				</Typography>
				<Typography
					variant='h6'
					color='text.secondary'
					sx={{ mb: 3 }}
				>
					The ultimate online chess platform for friends and competitors
				</Typography>
				<Chip
					label='Sign in to start playing!'
					color='primary'
					variant='outlined'
					sx={{ fontSize: "1rem", py: 1 }}
				/>
			</Box>

			<Paper
				elevation={2}
				sx={{ p: 2, textAlign: "center", mb: 4 }}
			>
				<Box sx={{ maxWidth: 600, mx: "auto" }}>
					<ChessboardAuto />
				</Box>
			</Paper>

			<Box sx={{ textAlign: "center" }}>
				<Button
					variant='contained'
					size='large'
					onClick={() => router.push("/auth/sign-in")}
					sx={{ px: 4, py: 1.5 }}
				>
					Sign In to Start Playing
				</Button>
			</Box>
		</Container>
	);

	if (status === "loading") {
		return (
			<Container
				maxWidth='lg'
				sx={{ mt: 4, textAlign: "center" }}
			>
				<Typography variant='h6'>Loading...</Typography>
			</Container>
		);
	}

	return (
		<>
			{status === "authenticated" ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
			<JoinMatchDialog
				open={joinDialogOpen}
				onClose={() => setJoinDialogOpen(false)}
			/>
		</>
	);
}
