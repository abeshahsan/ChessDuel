"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useRouter } from "next/navigation";

export default function NewGameModal({ gameurl }: { isOpen?: boolean; gameurl: string | null }) {

	const [isCopied, setIsCopied] = React.useState(false);

	const router = useRouter();

	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const players = useSelector((state: RootState) => state.match.players);

	return (
		<>
			<Dialog
				open={true}
				TransitionComponent={modalTransition}
				keepMounted
				aria-describedby='alert-dialog-slide-description'
				inert={true}
			>
				{!gameurl ? (
					<>
						<DialogTitle>{"Creating Game..."}</DialogTitle>
					</>
				) : (
					<>
						<DialogTitle sx={{ textAlign: "center" }}>
							{`${window.location.pathname.match("/new") ? "New" : "Join"} Match`}
						</DialogTitle>

						<Divider />

						<DialogContent
							sx={{
								display: "flex",
								gap: 1,
								flexDirection: { md: "row", sm: "column", xs: "column" },
							}}
						>
							<TextField
								variant='outlined'
								value={gameurl}
								slotProps={{ input: { readOnly: true } }}
								sx={{ width: { md: "80%", sm: "100%", xs: "100%" } }}
							/>

							<Button
								variant='contained'
								color='primary'
								onClick={() => {
									navigator.clipboard.writeText(gameurl ?? "");
									setIsCopied(true);
									setTimeout(() => setIsCopied(false), 2000);
								}}
							>
								{isCopied ? "Copied!" : "Copy"}
							</Button>
						</DialogContent>
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
								{players.map((player, index) => (
									<ListItem key={index}>
										<ListItemAvatar>
											<Avatar>
												<AccountCircle />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											sx={{
												opacity: player?.id ? 1 : 0.5,
											}}
											primary={player?.id ?? "Waiting for player"}
										/>
									</ListItem>
								))}
							</List>
						</DialogContent>
						<DialogContent sx={{ display: "flex", gap: 1 }}>
							<Button
								variant='contained'
								color='success'
								disabled={!players[1]}
								onClick={() => {
									socket?.emit("start_match");
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
					</>
				)}
			</Dialog>
		</>
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
