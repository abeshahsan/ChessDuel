"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket, io as ClientSocket } from "socket.io-client";

interface ClientSocketState {
	socket: Socket | null;
	subscribers: {
		[component: string]: {
			[event: string]: (...args: any[]) => void;
		}[];
	};
	sidebarOpen: boolean;
}

// Singleton Socket Initialization
let socket: Socket | null = null;

function initializeSocket(): Socket {
	if (!socket) {
		socket = ClientSocket({ path: "/api/socket" });
		socket.on("connect", () => {
			console.log("Connected to the server");
		});
		socket.on("disconnect", () => {
			console.log("Disconnected from the server");
		});
	}
	return socket;
}

// Redux Slice
const initialState: ClientSocketState = {
	socket: initializeSocket(),
	subscribers: {},
	sidebarOpen: false,
};

const clientSocketSlice = createSlice({
	name: "clientSocket",
	initialState,
	reducers: {
		disconnectSocket(state) {
			if (state.socket) {
				state.socket.disconnect();
				socket = null;
			}
			state.socket = null;
		},
		subscribe(state, action: PayloadAction<string>) {
			const subscriberName = action.payload;
			if (!state.subscribers[subscriberName]) {
				state.subscribers[subscriberName] = [];
			}
		},
		addEventHandler(
			state,
			action: PayloadAction<{ subscriberName: string; event: string; callback: (...args: any[]) => void }>
		) {
			const { subscriberName, event, callback } = action.payload;
			if (!state.subscribers[subscriberName]) {
				console.log(`Subscriber ${subscriberName} not found`);
				return;
			}
			state.subscribers[subscriberName].push({ [event]: callback });
			socket?.on(event, callback);
		},
		unsubscribeComponent(state, action: PayloadAction<string>) {
			const subscriberName = action.payload;
			if (state.subscribers[subscriberName]) {
				state.subscribers[subscriberName].forEach((subscriber) => {
					const [event, callback] = Object.entries(subscriber)[0];
					socket?.off(event, callback);
				});
				delete state.subscribers[subscriberName];
			}
		},
		unsubscribeEvent(state, action: PayloadAction<{ subscriberName: string; event: string }>) {
			const { subscriberName, event } = action.payload;
			if (state.subscribers[subscriberName]) {
				const subscriber = state.subscribers[subscriberName].find((subscriber) => {
					const [key] = Object.keys(subscriber);
					return key === event;
				});
				if (subscriber) {
					const [event, callback] = Object.entries(subscriber)[0];
					socket?.off(event, callback);
				}
			}
		},
		setSidebarOpen: (state, action) => {
			state.sidebarOpen = action.payload;
		},
	},
});

export const { disconnectSocket, subscribe, addEventHandler, unsubscribeComponent, unsubscribeEvent, setSidebarOpen } =
	clientSocketSlice.actions;

export const selectSocket = (state: { clientSocket: ClientSocketState }) => state.clientSocket.socket;

export default clientSocketSlice.reducer;
