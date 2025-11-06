"use client";

import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { SportsEsports as DiscordIcon } from "@mui/icons-material";
import { 
	Box, 
	Button, 
	Container, 
	Typography, 
	Paper, 
	CircularProgress,
	Alert,
	Divider
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";

function SignInContent() {
	const [loading, setLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const router = useRouter();
	const { data: session, status } = useSession();
	
	const callbackUrl = searchParams?.get("callbackUrl") || "/";
	const authError = searchParams?.get("error");

	useEffect(() => {
		if (status === "authenticated") {
			router.push(callbackUrl);
		}
	}, [status, router, callbackUrl]);

	useEffect(() => {
		if (authError) {
			setError("Authentication failed. Please try again.");
		}
	}, [authError]);

	const handleSignIn = async (provider: string) => {
		try {
			setLoading(provider);
			setError(null);
			
			const result = await signIn(provider, { 
				callbackUrl,
				redirect: false 
			});
			
			if (result?.error) {
				if (result.error === "Configuration") {
					setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} provider is not configured. Please contact the administrator.`);
				} else {
					setError("Authentication failed. Please try again.");
				}
			} else if (result?.url) {
				router.push(result.url);
			}
		} catch (error) {
			setError("An unexpected error occurred. Please try again.");
			console.error("Sign-in error:", error);
		} finally {
			setLoading(null);
		}
	};

	if (status === "loading") {
		return (
			<Container maxWidth="sm" sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
				<CircularProgress />
			</Container>
		);
	}

	if (status === "authenticated") {
		return (
			<Container maxWidth="sm" sx={{ mt: 8 }}>
				<Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
					<Typography variant="h5" gutterBottom>
						Welcome back!
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Redirecting you to your dashboard...
					</Typography>
					<CircularProgress sx={{ mt: 2 }} />
				</Paper>
			</Container>
		);
	}

	return (
		<Container maxWidth="sm" sx={{ mt: 8 }}>
			<Paper elevation={3} sx={{ p: 4 }}>
				<Box sx={{ textAlign: "center", mb: 4 }}>
					<Typography
						variant="h3"
						component="h1"
						gutterBottom
						sx={{ fontWeight: "bold", color: "primary.main" }}
					>
						Welcome to ChessDuel
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Sign in to challenge friends and play chess online
					</Typography>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Button
						variant="contained"
						size="large"
						startIcon={loading === "google" ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
						onClick={() => handleSignIn("google")}
						disabled={!!loading}
						sx={{ 
							py: 1.5,
							backgroundColor: "#db4437",
							"&:hover": { backgroundColor: "#c23321" }
						}}
					>
						{loading === "google" ? "Connecting..." : "Continue with Google"}
					</Button>

					<Button
						variant="contained"
						size="large"
						startIcon={loading === "facebook" ? <CircularProgress size={20} color="inherit" /> : <FacebookIcon />}
						onClick={() => handleSignIn("facebook")}
						disabled={!!loading}
						sx={{ 
							py: 1.5,
							backgroundColor: "#1877f2",
							"&:hover": { backgroundColor: "#166fe5" }
						}}
					>
						{loading === "facebook" ? "Connecting..." : "Continue with Facebook"}
					</Button>

					<Button
						variant="contained"
						size="large"
						startIcon={loading === "discord" ? <CircularProgress size={20} color="inherit" /> : <DiscordIcon />}
						onClick={() => handleSignIn("discord")}
						disabled={!!loading}
						sx={{ 
							py: 1.5,
							backgroundColor: "#5865f2",
							"&:hover": { backgroundColor: "#4752c4" }
						}}
					>
						{loading === "discord" ? "Connecting..." : "Continue with Discord"}
					</Button>
				</Box>

				{process.env.NODE_ENV === "development" && (
					<Alert severity="info" sx={{ mt: 2 }}>
						<Typography variant="caption">
							<strong>Development Mode:</strong> Configure OAuth providers in .env.local to enable authentication.
							<br />
							See OAUTH_SETUP_GUIDE.md for detailed instructions.
						</Typography>
					</Alert>
				)}

				<Divider sx={{ my: 3 }} />

				<Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", display: "block" }}>
					By signing in, you agree to our Terms of Service and Privacy Policy
				</Typography>
			</Paper>
		</Container>
	);
}

export default function SignInPage() {
	return (
		<Suspense fallback={
			<Container maxWidth="sm" sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
				<CircularProgress />
			</Container>
		}>
			<SignInContent />
		</Suspense>
	);
}
