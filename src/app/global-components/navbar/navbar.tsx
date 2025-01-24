import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "next/link";
import { auth, signIn } from "@/auth";
import UserMenu from "./user_menu";
import MdNavMenu from "./md_nav_menu";

// export const pages = ["Products", "Pricing", "Blog"];
export const pages = [];

async function ResponsiveAppBar() {
	const session = await auth();

	return (
		<AppBar
			position='fixed'
			sx={{ backgroundColor: "#333" }}
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

					<MdNavMenu pages={pages} />

					<div className="ml-10 hidden md:block"/>

					<Link className="flex flex-row mx-auto"
					href='/'>
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

					{session ? <UserMenu /> : <SignInButton />}
				</Toolbar>
			</Container>
		</AppBar>
	);
}

function SignInButton() {
	return (
		<form
			action={async () => {
				"use server";

				await signIn("github");
			}}
		>
			<Button
				variant='contained'
				sx={{ my: 2, display: "block", backgroundColor: "#fc8c03", ":hover": { backgroundColor: "#f5a623" } }}
				type='submit'
			>
				Sign in
			</Button>
		</form>
	);
}

export default ResponsiveAppBar;
