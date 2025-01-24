"use client";

import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "@/app/store/client_socket_slice";
import { RootState } from "@/app/store";

export default function MdNavMenu({ }: { pages: string[] }) {

	const dispatch = useDispatch();
	const sidebarOpen = useSelector((state: RootState) => state.clientSocket.sidebarOpen);


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
