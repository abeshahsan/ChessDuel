import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Metadata } from "next";
import StoreProvider from "./store/StoreProvider";
import { Box, Toolbar } from "@mui/material";
import NavAndDrawer from "./nav_and_drawer";

const drawerWidth = 240;

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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const left = 275;

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
						<NavAndDrawer
							// drawerWidth={drawerWidth}
						 />
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

