"use client";

import { Home, Info, Mail as MailIcon, MoveToInbox as InboxIcon, SportsEsports } from "@mui/icons-material";
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
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
	{ text: "Home", href: "/", icon: <Home /> },
	{ text: "About", href: "#", icon: <Info /> },
	{ text: "Contact", href: "#", icon: <MailIcon /> },
	{ text: "New-Match", href: "match/new", icon: <SportsEsports /> },
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

	const drawer = (
		<>
			<Toolbar />
			<Divider />
			<List>
				{navLinks.map(({ text, href, icon }, index) => (
					<ListItem
						key={index}
						component={Link}
						href={href}
						disablePadding
					>
						<ListItemButton selected={path === href}>
							<ListItemIcon>{icon}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
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
