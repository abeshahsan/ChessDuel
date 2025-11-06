"use client";

import { CircularProgress, Box, Typography } from "@mui/material";

interface LoadingProps {
	message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "50vh",
				gap: 2,
			}}
		>
			<CircularProgress size={40} />
			<Typography variant="body2" color="text.secondary">
				{message}
			</Typography>
		</Box>
	);
}