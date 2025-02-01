"use client";

import { Container, Typography, Button, Box } from "@mui/material";
import { signIn } from "next-auth/react";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

export default function SignInPage() {
	return (
		<Container>
			<Typography
				variant='h3'
				component='h1'
				sx={{ mt: 4, mb: 2 }}
			>
				Sign in
			</Typography>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<Button
					variant='contained'
					startIcon={<GitHubIcon />}
					onClick={() => signIn("github")}
				>
					Sign in with GitHub
				</Button>
				<Button
					variant='contained'
					startIcon={<GoogleIcon />}
					onClick={() => signIn("google")}
					color='error'
				>
					Sign in with Google
				</Button>
			</Box>
		</Container>
	);
}
