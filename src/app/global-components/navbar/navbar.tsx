"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import UserMenu from "./user_menu";
import { IconButton, Skeleton, Switch, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeToggle } from "@/app/store/StoreProvider";

export const pages = [];

function ResponsiveAppBar({ handleDrawerToggle }: { handleDrawerToggle: () => void }) {
	const toggleTheme = useThemeToggle();
	const theme = useTheme();

	return (
		<AppBar
			position='fixed'
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Link
						className='flex flex-row items-center'
						href='/'
					>
						<Box
							component='img'
							sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
							height={32}
							width={32}
							alt='ChessDuel Logo'
							src='/icons/android-chrome-512x512.png'
						/>
						<Typography
							variant='h6'
							noWrap
							sx={{
								mr: 1,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								// letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							ChessDuel
						</Typography>
					</Link>

					<Box sx={{ display: { xs: "flex", md: "none" } }}>
						<IconButton onClick={handleDrawerToggle}>
							<MenuIcon />
						</IconButton>
					</Box>

					<div className='ml-10 hidden md:block' />

					<Link
						className='flex flex-row mx-auto'
						href='/'
					>
						<Box
							component='img'
							sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
							height={32}
							width={32}
							alt='ChessDuel Logo'
							src='/icons/android-chrome-512x512.png'
						/>
						<Typography
							variant='h5'
							noWrap
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								// letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							ChessDuel
						</Typography>
					</Link>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{pages.map((page) => (
							<Button
								key={page}
								sx={{ my: 2, color: "white", display: "block" }}
							>
								{page}
							</Button>
						))}
					</Box>

					<Box
						display={"flex"}
						alignItems={"center"}
						justifyContent={"center"}
						gap={1.5}
					>
						<IconButton
							sx={{
								border: "1px solid",
								borderRadius: "50%",
								borderColor: "inherit",
							}}
						>
							{theme.palette.mode === "dark" ? (
								<DarkMode onClick={toggleTheme} />
							) : (
								<LightMode onClick={toggleTheme} />
							)}
						</IconButton>
						<NavbarActions />
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

// return usermenu, sign in button or loading skeleton

function LoadingSkeleton() {
	return (
		<>
			<Skeleton
				variant='circular'
				width={40}
				height={40}
			/>
			<Skeleton
				variant='rectangular'
				width={80}
				height={40}
			/>
		</>
	);
}

function NavbarActions() {
	const { data: session, status } = useSession();

	if (status === "loading") return <LoadingSkeleton />;

	return session?.user ? <UserMenu /> : <SignInButton />;
}

function SignInButton() {
	return (
		<Button
			variant='contained'
			sx={{ 
				my: 2, 
				display: "block", 
				backgroundColor: "#fc8c03", 
				":hover": { backgroundColor: "#f5a623" },
				fontWeight: "bold"
			}}
			onClick={() => signIn(undefined, { callbackUrl: window.location.pathname })}
		>
			Sign in
		</Button>
	);
}

export default ResponsiveAppBar;
