"use client";

import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "@/app/store/client_socket_slice";
import { RootState } from "@/app/store";

export default function MdNavMenu({ pages }: { pages: string[] }) {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const dispatch = useDispatch();
	const sidebarOpen = useSelector((state: RootState) => state.clientSocket.sidebarOpen);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<Box sx={{ display: { xs: "flex", md: "none" } }}>
			<IconButton
				size='large'
				aria-label='account of current user'
				aria-controls='menu-appbar'
				aria-haspopup='true'
				onClick={() => {
					dispatch(setSidebarOpen(!sidebarOpen));
				}}
				color='inherit'
			>
				<MenuIcon />
			</IconButton>
		</Box>
	);
}
