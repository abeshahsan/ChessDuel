import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MatchState {
	id: string;
	players: {
		color: string;
		id: string;
		socketID: string;
	}[];
	state?: {
		turn: string;
		history: string[];
	};
}

const initialState: MatchState = {
	id: "",
	players: [
		{
			color: "",
			id: "",
			socketID: "",
		},
		{
			color: "",
			id: "",
			socketID: "",
		},
	],
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
			state.players = [
				action.payload.players[0],
				action.payload.players[1],
			];
			state.state = action.payload.state;
		},
		updateMatch: (state, action: PayloadAction<MatchState>) => {
			state.id = action.payload.id;
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
