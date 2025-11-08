"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
	Container,
	Typography,
	Box,
	Paper,
	Grid,
	Button,
	Card,
	Avatar,
	Chip,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Divider,
	IconButton,
} from "@mui/material";
import {
	SportsEsports as NewMatchIcon,
	History as HistoryIcon,
	TrendingUp as StatsIcon,
	Group as JoinMatchIcon,
	EmojiEvents as TrophyIcon,
	AccessTime as TimeIcon,
	Refresh as RefreshIcon,
} from "@mui/icons-material";
import AuthGuard from "../components/AuthGuard";
import ProfileGuard from "../components/ProfileGuard";
import JoinMatchDialog from "../components/JoinMatchDialog";
import { selectUserProfile } from "../store/user_profile_slice";

const DashboardContent = () => {
	const userProfile = useSelector(selectUserProfile);
	const router = useRouter();
	const [joinDialogOpen, setJoinDialogOpen] = useState(false);

	// Mock data for demonstration - in a real app, this would come from your backend
	const recentMatches = [
		{
			id: 1,
			opponent: "Chess Master",
			result: "Win",
			date: "2024-01-15",
			duration: "25 min",
		},
		{
			id: 2,
			opponent: "Knight Rider",
			result: "Loss",
			date: "2024-01-14",
			duration: "18 min",
		},
		{
			id: 3,
			opponent: "Pawn Star",
			result: "Draw",
			date: "2024-01-13",
			duration: "45 min",
		},
	];

	const stats = {
		totalGames: 42,
		wins: 28,
		losses: 10,
		draws: 4,
		winRate: "66.7%",
		avgGameTime: "23 min",
		currentRating: 1456,
		bestWinStreak: 8,
	};

	const getResultColor = (result: string) => {
		switch (result.toLowerCase()) {
			case "win":
				return "success";
			case "loss":
				return "error";
			case "draw":
				return "warning";
			default:
				return "default";
		}
	};

	const quickActions = [
		{
			icon: <NewMatchIcon />,
			title: "New Match",
			description: "Start a new game",
			action: () => router.push("/match/new"),
			color: "primary" as const,
		},
		{
			icon: <JoinMatchIcon />,
			title: "Join Match",
			description: "Enter match code",
			action: () => setJoinDialogOpen(true),
			color: "secondary" as const,
		},
		{
			icon: <TrophyIcon />,
			title: "Tournaments",
			description: "Coming soon",
			action: () => {},
			color: "warning" as const,
			disabled: true,
		},
		{
			icon: <TimeIcon />,
			title: "Quick Play",
			description: "Coming soon",
			action: () => {},
			color: "info" as const,
			disabled: true,
		},
	];

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Welcome Section */}
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" gutterBottom>
					Welcome back, {userProfile?.ign || "Player"}!
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Ready for your next chess adventure? Here's your gaming overview.
				</Typography>
			</Box>

			{/* Quick Actions */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{quickActions.map((action, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<Card
							elevation={2}
							sx={{
								textAlign: "center",
								p: 2,
								cursor: action.disabled ? "default" : "pointer",
								opacity: action.disabled ? 0.6 : 1,
								"&:hover": action.disabled
									? {}
									: {
											elevation: 4,
											transform: "translateY(-2px)",
											transition: "all 0.2s ease-in-out",
									  },
							}}
							onClick={action.disabled ? undefined : action.action}
						>
							<Box
								sx={{
									color: `${action.color}.main`,
									fontSize: 40,
									mb: 1,
									display: "flex",
									justifyContent: "center",
								}}
							>
								{action.icon}
							</Box>
							<Typography variant="h6" gutterBottom>
								{action.title}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{action.description}
							</Typography>
							{action.disabled && (
								<Chip label="Soon" size="small" color="default" sx={{ mt: 1 }} />
							)}
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Stats and Info */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{/* Game Statistics */}
				<Grid item xs={12} md={8}>
					<Paper elevation={2} sx={{ p: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
							<StatsIcon sx={{ mr: 1, color: "primary.main" }} />
							<Typography variant="h6">Performance Overview</Typography>
							<IconButton size="small" sx={{ ml: "auto" }}>
								<RefreshIcon />
							</IconButton>
						</Box>

						<Grid container spacing={3}>
							<Grid item xs={6} md={3}>
								<Box sx={{ textAlign: "center" }}>
									<Typography variant="h4" color="primary.main">
										{stats.totalGames}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Total Games
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={6} md={3}>
								<Box sx={{ textAlign: "center" }}>
									<Typography variant="h4" color="success.main">
										{stats.wins}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Wins
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={6} md={3}>
								<Box sx={{ textAlign: "center" }}>
									<Typography variant="h4" color="error.main">
										{stats.losses}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Losses
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={6} md={3}>
								<Box sx={{ textAlign: "center" }}>
									<Typography variant="h4" color="warning.main">
										{stats.draws}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Draws
									</Typography>
								</Box>
							</Grid>
						</Grid>

						<Divider sx={{ my: 3 }} />

						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<Typography variant="body1" gutterBottom>
									Win Rate: <strong>{stats.winRate}</strong>
								</Typography>
								<Typography variant="body1" gutterBottom>
									Average Game Time: <strong>{stats.avgGameTime}</strong>
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body1" gutterBottom>
									Current Rating: <strong>{stats.currentRating}</strong>
								</Typography>
								<Typography variant="body1" gutterBottom>
									Best Win Streak: <strong>{stats.bestWinStreak}</strong>
								</Typography>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				{/* Player Card */}
				<Grid item xs={12} md={4}>
					<Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
						<Avatar
							sx={{
								width: 80,
								height: 80,
								mx: "auto",
								mb: 2,
								bgcolor: "primary.main",
								fontSize: 28,
							}}
						>
							{userProfile?.ign ? userProfile.ign.charAt(0).toUpperCase() : "?"}
						</Avatar>
						<Typography variant="h6" gutterBottom>
							{userProfile?.ign || "Unknown Player"}
						</Typography>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							Rating: {stats.currentRating}
						</Typography>
						<Box sx={{ mt: 2 }}>
							<Chip label="Active Player" size="small" color="primary" />
						</Box>
						<Box sx={{ mt: 2 }}>
							<Button
								variant="outlined"
								size="small"
								fullWidth
								onClick={() => router.push("/profile")}
							>
								View Profile
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>

			{/* Recent Matches */}
			<Paper elevation={2} sx={{ p: 3 }}>
				<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
					<HistoryIcon sx={{ mr: 1, color: "primary.main" }} />
					<Typography variant="h6">Recent Matches</Typography>
				</Box>
				<List>
					{recentMatches.map((match, index) => (
						<React.Fragment key={match.id}>
							{index > 0 && <Divider />}
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										{match.opponent
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()}
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={match.opponent}
									secondary={`${match.date} • Duration: ${match.duration}`}
								/>
								<Chip
									label={match.result}
									size="small"
									color={getResultColor(match.result) as any}
									variant="outlined"
								/>
							</ListItem>
						</React.Fragment>
					))}
				</List>
				<Box sx={{ mt: 2, textAlign: "center" }}>
					<Button variant="outlined" disabled>
						View All Matches
					</Button>
				</Box>
			</Paper>

			{/* Join Match Dialog */}
			<JoinMatchDialog
				open={joinDialogOpen}
				onClose={() => setJoinDialogOpen(false)}
			/>
		</Container>
	);
};

const Dashboard = () => {
	return (
		<AuthGuard>
			<ProfileGuard>
				<DashboardContent />
			</ProfileGuard>
		</AuthGuard>
	);
};

export default Dashboard;