import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import StoreProvider from "./store/StoreProvider";
import { Box, Toolbar } from "@mui/material";
import NavAndDrawer from "./global-components/nav_and_drawer";

import "@/app/globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning={true}
			>
				<StoreProvider>
					<Box sx={{ display: "flex" }}>
						<NavAndDrawer drawerWidth={drawerWidth} />
						<Box
							component='main'
							sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
						>
							<Toolbar />
							{children}
						</Box>
					</Box>
				</StoreProvider>
			</body>
		</html>
	);
}

