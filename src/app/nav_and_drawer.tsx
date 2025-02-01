'use client';

import { useState } from "react";
import ResponsiveAppBar from "./global-components/navbar/navbar";
import ResponsiveDrawer from "./global-components/sidebar/sidebar";

const drawerWidth = 240;

export default function NavAndDrawer() {
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