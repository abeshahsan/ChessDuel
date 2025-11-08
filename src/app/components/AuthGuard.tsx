"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Loading from "../components/loading";
import { Container, Paper, Typography, Button, Box } from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";

interface AuthGuardProps {
	children: ReactNode;
	fallback?: ReactNode;
	redirectTo?: string;
}

export default function AuthGuard({ 
	children, 
	fallback,
	redirectTo = "/auth/sign-in" 
}: AuthGuardProps) {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			// Store the current URL for redirect after login
			const currentUrl = window.location.pathname + window.location.search;
			const signInUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentUrl)}`;
			setTimeout(() => router.push(signInUrl), 100);
		}
	}, [status, router, redirectTo]);

	// Show loading while checking authentication
	if (status === "loading") {
		return <Loading message="Checking authentication..." />;
	}

	// Show fallback or redirect to sign-in if not authenticated
	if (status === "unauthenticated") {
		if (fallback) {
			return <>{fallback}</>;
		}

		return (
			<Container maxWidth="md" sx={{ mt: 8 }}>
				<Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
					<Typography variant="h4" component="h1" gutterBottom>
						Authentication Required
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
						You need to sign in to access this feature. Please log in to continue.
					</Typography>
					<Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
						<Button
							variant="contained"
							startIcon={<LoginIcon />}
							onClick={() => {
								const currentUrl = window.location.pathname + window.location.search;
								const signInUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentUrl)}`;
								router.push(signInUrl);
							}}
						>
							Sign In
						</Button>
						<Button
							variant="outlined"
							onClick={() => router.push("/")}
						>
							Go Home
						</Button>
					</Box>
				</Paper>
			</Container>
		);
	}

	// User is authenticated, render children
	return <>{children}</>;
}