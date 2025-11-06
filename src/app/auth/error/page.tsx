"use client";

import { Box, Button, Container, Typography, Alert } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const error = searchParams?.get("error");

	const getErrorMessage = (error: string | null | undefined) => {
		switch (error) {
			case "Configuration":
				return "There is a problem with the server configuration.";
			case "AccessDenied":
				return "You do not have permission to sign in.";
			case "Verification":
				return "The verification token has expired or has already been used.";
			case "Default":
			default:
				return "An error occurred during authentication.";
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 8 }}>
			<Box sx={{ textAlign: "center", mb: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Authentication Error
				</Typography>
				<Alert severity="error" sx={{ mb: 3 }}>
					{getErrorMessage(error)}
				</Alert>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
					Sorry, there was a problem signing you in. Please try again.
				</Typography>
				<Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
					<Button
						variant="contained"
						onClick={() => router.push("/auth/sign-in")}
					>
						Try Again
					</Button>
					<Button
						variant="outlined"
						onClick={() => router.push("/")}
					>
						Go Home
					</Button>
				</Box>
			</Box>
		</Container>
	);
}

export default function AuthErrorPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ErrorContent />
		</Suspense>
	);
}