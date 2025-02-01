"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Container, Typography } from "@mui/material";
import { signIn } from "next-auth/react";


export default function SignInPage() {

	const handleSignIn = async (provider: string) => {
		try {
			await signIn(provider, { redirectTo: "/" });
			console.log("Sign-in successful");
			
		} catch (error) {
			console.error("Sign-in error:", error);
		}
	};

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
					onClick={() => handleSignIn("github")}
				>
					Sign in with GitHub
				</Button>
				<Button
					variant='contained'
					startIcon={<GoogleIcon />}
					onClick={() => handleSignIn("google")}
					color='error'
				>
					Sign in with Google
				</Button>
			</Box>
		</Container>
	);
}
