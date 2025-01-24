"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function NewGameModal({ isOpen }: { isOpen?: boolean }) {
	const [open, setOpen] = React.useState(isOpen ?? true);

	const [isCopied, setIsCopied] = React.useState(false);
	const [newMatchLink] = React.useState("https://chess.com");

	const handleClickOpen = () => {
		setOpen(true);
	};

	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const players = useSelector((state: RootState) => state.match.players);

	return (
		<>
			<Button
				variant='outlined'
				onClick={handleClickOpen}
			>
				Slide in alert dialog
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				aria-describedby='alert-dialog-slide-description'
				inert={!open}
			>
				<DialogTitle>{"Copy the link"}</DialogTitle>

				<DialogContent
					sx={{
						display: "flex",
						gap: 1,
						flexDirection: { md: "row", sm: "column", xs: "column" },
					}}
				>
					<TextField
						variant='outlined'
						value={newMatchLink}
						slotProps={{ input: { readOnly: true } }}
						sx={{ width: { md: "80%", sm: "100%", xs: "100%" } }}
					/>

					<Button
						variant='contained'
						color='primary'
						onClick={() => {
							navigator.clipboard.writeText(newMatchLink);
							setIsCopied(true);
							setTimeout(() => setIsCopied(false), 2000);
						}}
					>
						{isCopied ? "Copied!" : "Copy"}
					</Button>
				</DialogContent>
				<DialogContent
					sx={{ border: 2, borderColor: "divider", margin: 2, marginTop: 0, borderRadius: 2, padding: 0 }}
				>
					<List>
						{players.map((player, index) => (
							<ListItem key={index}>
								<ListItemAvatar>
									<Avatar>
										<AccountCircle />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={player?.id?? 'Waiting for player'} />
							</ListItem>
						))}
					</List>
				</DialogContent>
			</Dialog>
		</>
	);
}

const Transition = React.forwardRef(function Transition(
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
