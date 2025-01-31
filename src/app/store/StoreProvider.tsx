"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from ".";
import { useEffect } from "react";
import { initializeSocketAfterLoad } from "./client_socket_slice";
import { ThemeProvider } from "@mui/material";
import theme from "../theme";
import { SessionProvider } from "next-auth/react";

export default function StoreProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<SessionProvider>
					<_StoreProviderComponent>{children}</_StoreProviderComponent>
				</SessionProvider>
			</ThemeProvider>
		</Provider>
	);
}

function _StoreProviderComponent({ children }: Readonly<{ children: React.ReactNode }>) {
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
