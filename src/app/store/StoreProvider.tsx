"use client";

import { createContext, useContext } from "react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from ".";
import { lightTheme, darkTheme } from "../theme";
import { initializeSocketAfterLoad } from "./client_socket_slice";

function _SocketProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const socket = useSelector((state: RootState) => state.clientSocket.socket);
	const dispatch = useDispatch();

	useEffect(() => {
		let clientId = localStorage.getItem("clientId");

		dispatch(initializeSocketAfterLoad(clientId));

		if (!clientId) {
			clientId = socket?.id || null;
			localStorage.setItem("clientId", clientId ?? "");
		}
	}, [dispatch]);

	return <>{children}</>;
}

const ThemeToggleContext = createContext<() => void>(() => {});

export function useThemeToggle() {
	return useContext(ThemeToggleContext);
}

function _ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const [themeMode, setTheme] = useState(themeModeString(prefersDarkMode));

	function themeModeString(prefersDarkMode: boolean): "light" | "dark" {
		return prefersDarkMode ? "dark" : "light";
	}

	useEffect(() => {
		if (localStorage.getItem("theme") !== null) {
			setTheme(localStorage.getItem("theme") as "light" | "dark");
		} else {
			setTheme(themeModeString(prefersDarkMode));
			localStorage.setItem("theme", themeMode);
		}
	}, [prefersDarkMode]);

	const theme = useMemo(() => (themeMode === "light" ? lightTheme : darkTheme), [themeMode]);

	function toggleTheme() {
		console.log("toggle theme");
		
		setTheme((prevTheme) => {
			const newTheme = prevTheme === "light" ? "dark" : "light";
			localStorage.setItem("theme", newTheme);
			return newTheme;
		});
	}

	return (
		<ThemeToggleContext.Provider value={toggleTheme}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeToggleContext.Provider>
	);
}

export default function StoreProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<Provider store={store}>
			<_ThemeProvider>
				<CssBaseline />
				<SessionProvider>
					<_SocketProvider>{children}</_SocketProvider>
				</SessionProvider>
			</_ThemeProvider>
		</Provider>
	);
}
