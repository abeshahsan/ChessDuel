"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography, Chip, Box, Stack, Tooltip } from "@mui/material";
import { AccountCircle, ContentCopy, CheckCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState } from "@/app/store";
import { useRouter, usePathname } from "next/navigation";
import { addEventHandler } from "@/app/store/client_socket_slice";
import { updateMatch } from "@/app/store/match_slice";
import { subscribe, unsubscribeComponent } from "@/app/store/client_socket_slice";
import { selectUserProfile } from "@/app/store/user_profile_slice";

export default function NewGameModal({ gameurl }: { isOpen?: boolean; gameurl: string | null }) {
	const [isCopied, setIsCopied] = React.useState(false);

	const router = useRouter();
	const { data: session } = useSession();
	const userProfile = useSelector(selectUserProfile);

	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const players = useSelector((state: RootState) => state.match.players);
	const match = useSelector((state: RootState) => state.match);
	const dispatch = useDispatch();

	const isJoinGame = usePathname()?.includes("/join");

	React.useEffect(() => {
		dispatch(subscribe(NewGameModal.name));

		if (socket?.active) {
			dispatch(
				addEventHandler({
					subscriberName: NewGameModal.name,
					event: "match-started",
					callback: (match) => router.push(`/match/${match.id}`),
				})
			);
			dispatch(
				addEventHandler({
					subscriberName: NewGameModal.name,
					event: "match-joined",
					callback: (match) => {
						console.log("NewGameModal: Match updated with new player:", match);
						dispatch(updateMatch(match));
					},
				})
			);
				dispatch(
					addEventHandler({
						subscriberName: NewGameModal.name,
						event: "match-expired",
						callback: () => {
							alert("Match expired.");
							router.push("/");
						},
					})
				);
				dispatch(
					addEventHandler({
						subscriberName: NewGameModal.name,
						event: "match-cancelled",
						callback: () => {
							alert("Match cancelled.");
							router.push("/");
						},
					})
				);
		}
		return () => {
			dispatch(unsubscribeComponent(NewGameModal.name));
		};
	}, [socket?.active, dispatch]);

	return (
		<Dialog
			open={true}
			TransitionComponent={modalTransition}
			keepMounted
			aria-describedby='alert-dialog-slide-description'
			disableScrollLock={true} // Prevent scrollbar hiding
			inert={false}
		>
			<DialogTitle sx={{ textAlign: "center" }}>
				<Stack direction="row" alignItems="center" gap={1} justifyContent="center">
					{`${!isJoinGame ? "New" : "Join"} Match`}
					<Tooltip title={socket?.connected ? "Connected" : "Disconnected"}>
						<Chip size="small" label={socket?.connected ? "Online" : "Offline"} color={socket?.connected ? "success" : "default"} />
					</Tooltip>
				</Stack>
			</DialogTitle>

			<Divider />

			{!isJoinGame && (
				<DialogContent
					sx={{
						display: "flex",
						gap: 1,
						flexDirection: { md: "row", sm: "column", xs: "column" },
					}}
				>
					<TextField
						variant='outlined'
						value={gameurl ?? ""}
						slotProps={{ input: { readOnly: true } }}
						sx={{ width: { md: "80%", sm: "100%", xs: "100%" } }}
					/>

					<Button
						variant='contained'
						color='primary'
						startIcon={isCopied ? <CheckCircle /> : <ContentCopy />}
						onClick={() => {
							navigator.clipboard.writeText(gameurl ?? "");
							setIsCopied(true);
							setTimeout(() => setIsCopied(false), 2000);
						}}
						disabled={!gameurl}
					>
						{isCopied ? "Copied!" : "Copy Link"}
					</Button>
				</DialogContent>
			)}
			<DialogContent
				sx={{
					border: 2,
					borderColor: "divider",
					margin: 2,
					marginTop: 0,
					borderRadius: 2,
					padding: 0,
				}}
			>
				<List>
					{/* Row 1: Host info (Create vs Join) */}
					<ListItem>
						{(() => {
							const firstRow = isJoinGame
								? (players[0] || {})
								: ({ 
									name: userProfile?.ign || session?.user?.name || 'You', 
									email: session?.user?.email 
								});
							const name = (firstRow as any).name || (isJoinGame ? 'Host' : 'You');
							const email = (firstRow as any).email;
							const userInitials = name.length >= 2 
								? name.substring(0, 2).toUpperCase()
								: name.charAt(0).toUpperCase();
							return (
								<>
									<ListItemAvatar>
										<Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
											{userInitials}
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<Typography variant="body1" fontWeight="bold">{name}</Typography>
												<Chip label="Host" size="small" color="primary" />
											</Box>
										}
										secondary={email}
									/>
									<Typography variant="body2" color="text.secondary">White</Typography>
								</>
							);
						})()}
					</ListItem>

					{/* Row 2: Opponent or Waiting */}
					<ListItem>
						{(() => {
							// For create flow, opponent is players[1] or waiting.
							// For join flow, show the joining user's info on second row until server confirms (players[1]).
							const secondRow = isJoinGame
								? (players[1] || { name: session?.user?.name || 'You', email: session?.user?.email, image: session?.user?.image })
								: (players[1] || null);
							const hasOpponent = !!players[1];
							const name = secondRow ? secondRow.name : undefined;
							const email = secondRow ? secondRow.email : undefined;
							const image = secondRow ? secondRow.image : undefined;
							return (
								<>
									<ListItemAvatar>
										<Avatar src={image || ''} alt={name || 'Opponent'} sx={{ width: 48, height: 48, opacity: hasOpponent ? 1 : 0.3 }}>
											{hasOpponent && !image && name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : (!hasOpponent ? <AccountCircle /> : null)}
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										sx={{ opacity: hasOpponent ? 1 : 0.5 }}
										primary={
											<Typography variant="body1" fontWeight={hasOpponent ? 'bold' : 'normal'}>
												{name ?? (isJoinGame ? 'Joining...' : 'Waiting for opponent...')}
											</Typography>
										}
										secondary={hasOpponent ? (email || 'Ready to play') : (isJoinGame ? 'Connecting to host' : 'Share the link to invite someone')}
									/>
									<Typography variant="body2" color="text.secondary">{hasOpponent ? 'Black' : ''}</Typography>
								</>
							);
						})()}
					</ListItem>
				</List>
			</DialogContent>
			<DialogContent sx={{ display: "flex", gap: 1 }}>
				<Button
					variant='contained'
					color='success'
					disabled={!players[1]}
					onClick={() => {
						socket?.emit("start-match", match.id);
					}}
				>
					Start Match
				</Button>
				<Button
					variant='outlined'
					sx={{ ":hover": { backgroundColor: "red", color: "white" } }}
					color='error'
					onClick={() => {
						socket?.emit("cancel_match");
						router.push("/");
					}}
				>
					Cancel Match
				</Button>
			</DialogContent>
		</Dialog>
	);
}

const modalTransition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return (
		<Slide
			direction='up'
			ref={ref}
			{...props}
		/>
	);
});
