import { Box, Toolbar } from "@mui/material";
import { Metadata } from "next";
import NavAndDrawer from "./global-components/nav_and_drawer";
import StoreProvider from "./store/StoreProvider";
import AuthProvider from "./providers/auth-provider";

import "@/app/globals.css";

export const metadata: Metadata = {
	title: "ChessDuel",
	description: "Play chess with your friends",
};

const drawerWidth = 240;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning={true}
		>
			<body suppressHydrationWarning={true}>
				<AuthProvider>
					<StoreProvider>
						<Box sx={{ display: "flex" }}>
							<NavAndDrawer drawerWidth={drawerWidth} />
							<Box
								component='main'
								sx={{
									flexGrow: 1,
									p: 3,
									width: { sm: `calc(100% - ${drawerWidth}px)` },
								}}
							>
								<Toolbar />
								{children}
							</Box>
						</Box>
					</StoreProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

