"use client";

import { useState } from "react";
import ResponsiveAppBar from "./navbar/navbar";
import ResponsiveDrawer from "./sidebar/sidebar";

export default function NavAndDrawer({ drawerWidth }: Readonly<{ drawerWidth: number }>) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		console.log("handleDrawerToggle");

		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};
	return (
		<>
			<ResponsiveAppBar handleDrawerToggle={handleDrawerToggle} />
			<ResponsiveDrawer
				drawerWidth={drawerWidth}
				mobileOpen={mobileOpen}
				handleDrawerClose={handleDrawerClose}
				handleDrawerTransitionEnd={handleDrawerTransitionEnd}
			/>
		</>
	);
}
