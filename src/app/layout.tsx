import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/app/global-components/navbar/navbar";
import Sidebar from "@/app/global-components/sidebar/sidebar";
import { Metadata } from "next";
import StoreProvider from "./store/StoreProvider";

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

export default function RootLayout({
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
				className={`${geistSans.variable} ${geistMono.variable} antialiased pt-20 `}
				suppressHydrationWarning={true}
			>
				<StoreProvider>
					<Navbar />
					<Sidebar />
					<div className={`md:ml-[${left}px] md:w-[calc(100%-${left}px)]`}>{children}</div>
				</StoreProvider>
			</body>
		</html>
	);
}

