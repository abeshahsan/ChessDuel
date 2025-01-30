"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from ".";
import { use, useEffect, useState } from "react";
import { initializeSocketAfterLoad } from "./client_socket_slice";

export default function StoreProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<Provider store={store}>
			<_StoreProviderComponent>{children}</_StoreProviderComponent>
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
