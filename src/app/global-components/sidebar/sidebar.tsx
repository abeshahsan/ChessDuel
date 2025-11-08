"use client";

import { Home, Info, Mail as MailIcon, SportsEsports, Lock, Dashboard } from "@mui/icons-material";
import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	Tooltip,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const publicLinks = [
	{ text: "Home", href: "/", icon: <Home /> },
	{ text: "About", href: "#", icon: <Info /> },
	{ text: "Contact", href: "#", icon: <MailIcon /> },
];

const authenticatedLinks = [
	{ text: "Dashboard", href: "/dashboard", icon: <Dashboard /> },
	{ text: "New Match", href: "/match/new", icon: <SportsEsports /> },
];

export default function ResponsiveDrawer({
	drawerWidth,
	mobileOpen,
	handleDrawerClose,
	handleDrawerTransitionEnd,
}: {
	drawerWidth: number;
	mobileOpen: boolean;
	handleDrawerClose: () => void;
	handleDrawerTransitionEnd: () => void;
}) {
	const path = usePathname() as string;
	const { data: session, status } = useSession();

	const renderNavLinks = () => {
		const linksToRender = [...publicLinks];
		
		if (status === "authenticated") {
			linksToRender.push(...authenticatedLinks);
		}

		return linksToRender.map(({ text, href, icon }, index) => {
			const isDisabled = href === "#";
			
			return (
				<ListItem
					key={index}
					component={isDisabled ? "div" : Link}
					href={isDisabled ? undefined : href}
					disablePadding
				>
					<ListItemButton 
						selected={path === href}
						disabled={isDisabled}
					>
						<ListItemIcon>{icon}</ListItemIcon>
						<ListItemText primary={text} />
					</ListItemButton>
				</ListItem>
			);
		});
	};

	const renderAuthenticationPrompt = () => {
		if (status === "unauthenticated") {
			return (
				<>
					<Divider />
					<Box sx={{ p: 2 }}>
						<Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
							Chess Features
						</Typography>
						<Tooltip title="Sign in to create and join matches">
							<ListItem disablePadding>
								<ListItemButton 
									disabled
									sx={{ opacity: 0.6 }}
								>
									<ListItemIcon>
										<Lock fontSize="small" />
									</ListItemIcon>
									<ListItemText 
										primary="New Match" 
										secondary="Sign in required"
									/>
								</ListItemButton>
							</ListItem>
						</Tooltip>
					</Box>
				</>
			);
		}
		return null;
	};

	const drawer = (
		<>
			<Toolbar />
			<Divider />
			<List>
				{renderNavLinks()}
			</List>
			{renderAuthenticationPrompt()}
			<Divider />
		</>
	);

	return (
		<Box
			component='nav'
			sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
		>
			<Drawer
				variant='temporary'
				open={mobileOpen}
				onTransitionEnd={handleDrawerTransitionEnd}
				onClose={handleDrawerClose}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
					disableScrollLock: true, // Prevent scrollbar hiding
				}}
				sx={{
					zIndex: (theme) => theme.zIndex.drawer,
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant='persistent'
				sx={{
					display: { xs: "none", md: "block" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
}
