import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
	id: string;
	name: string;
	email?: string;
	image?: string;
	color: "white" | "black";
	socketID: string;
}

export type MatchStatus = "pending" | "ready" | "started" | "finished" | "cancelled" | "waiting" | "playing";

export interface MatchState {
	id: string;
	createdAt?: Date;
	status?: MatchStatus;
	players: Player[];
	state?: {
		turn: string;
		history: string[];
	};
}

const initialState: MatchState = {
	id: "",
	players: [],
	state: {
		turn: "",
		history: [],
	},
};

const matchSlice = createSlice({
	name: "match",
	initialState,
	reducers: {
		createMatch: (state, action: PayloadAction<MatchState>) => {
			state.id = action.payload.id;
			state.createdAt = action.payload.createdAt;
			state.status = action.payload.status;
			state.players = action.payload.players;
			state.state = action.payload.state;
		},
		updateMatch: (state, action: PayloadAction<MatchState>) => {
			state.id = action.payload.id;
			state.status = action.payload.status ?? state.status;
			state.players = action.payload.players;
			state.state = action.payload.state;
		},
		deleteMatch: (state) => {
			state.id = "";
			state.players = [];
			state.state = {
				turn: "",
				history: [],
			};
		},
	},
});

export const { createMatch, updateMatch, deleteMatch } = matchSlice.actions;
export default matchSlice.reducer;
