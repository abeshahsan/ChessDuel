"use client";

import React, { useEffect, useRef, useState } from "react";
import { Socket, io as ClientSocket } from "socket.io-client";

// Create the WebSocket context
export const WebSocketContext = React.createContext<{
	socket: Socket | null;
	subscribe: (subscriberName: string) => void;
	addEventHandler: (subscriberName: string, event: string, callback: (...args: any[]) => void) => void;
	unsubscribeComponent: (subscriberName: string) => void;
	unsubscribeEvent: (subscriberName: string, event: string) => void;
	sidebarOpen: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
	socket: null,
	subscribe: () => () => {},
	addEventHandler: () => {},
	unsubscribeComponent: () => {},
	unsubscribeEvent: () => {},
	sidebarOpen: false,
	setSidebarOpen: () => {},
});

type SocketSubscriber = {
	[component: string]: {
		[event: string]: (...args: any[]) => void;
	}[];
};

export function useWebsocketContext() {
	return React.useContext(WebSocketContext);
}

export function WebSocketContextProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const { user } = useUserContext();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const subscribers = useRef<SocketSubscriber>({});

	useEffect(() => {
		const _socket = ClientSocket({ path: "/api/socket" });

		_socket.on("connect", () => {
			console.log("Connected to the server");
		});

		setSocket(_socket);

		return () => {
			_socket.disconnect();
		};
	}, []);

	const subscribe = (subscriberName: string) => {
		if (!subscribers.current[subscriberName]) {
			subscribers.current[subscriberName] = [];
		}
	};

	const addEventHandler = (subscriberName: string, event: string, callback: (...args: any[]) => void) => {
		if (!subscribers.current[subscriberName]) {
			console.log(`Subscriber ${subscriberName} not found`);
			return;
		}

		subscribers.current[subscriberName].push({ [event]: callback });

		socket?.on(event, callback);
	};

	const unsubscribeComponent = (subscriberName: string) => {
		if (subscribers.current[subscriberName]) {
			subscribers.current[subscriberName].forEach((subscriber) => {
				const [event, callback] = Object.entries(subscriber)[0];

				socket?.off(event, callback);
			});

			delete subscribers.current[subscriberName];
		}
	};

	const unsubscribeEvent = (subscriberName: string, event: string) => {
		if (subscribers.current[subscriberName]) {
			const subscriber = subscribers.current[subscriberName].find((subscriber) => {
				const [key] = Object.keys(subscriber);

				return key === event;
			});

			if (subscriber) {
				const [event, callback] = Object.entries(subscriber)[0];

				socket?.off(event, callback);
			}
		}
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket,
				subscribe,
				addEventHandler,
				unsubscribeComponent,
				unsubscribeEvent,
				sidebarOpen,
				setSidebarOpen,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
}
