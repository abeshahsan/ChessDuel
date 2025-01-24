'use client';

import { configureStore } from "@reduxjs/toolkit";
import clientSocketReducer from './client_socket_slice';
import matchReducer from './match_slice';

export const store = configureStore({
	reducer: {
		clientSocket: clientSocketReducer,
		match: matchReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
