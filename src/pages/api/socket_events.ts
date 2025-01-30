import { match } from "assert";
import { Server, Socket } from "socket.io";

type Match = {
	id: string;
	players: {
		id: string;
		color: string;
		socketID: string;
	}[];
};

type persistenSocketIDs = {
	[clientId: string]: string;
};

export const allClientIDs: persistenSocketIDs = {};

let activeMatches: { [matchId: string]: Match } = {};

export function addSocketEvents(socket: Socket) {
	socket.on("message", (message: string) => {
		console.log(`Message received: ${message}--${socket.id}`);
		socket.broadcast.emit("message", "Hello from server");
	});

	socket.on("chess-move", (matchID: string, move: string) => {
		// console.log(`Chess move received: ${matchID}`);
		// console.log(`Chess move received: ${JSON.stringify(move)}`);
		const match = activeMatches[matchID];
		if (match) {
			const opponent = match.players.filter((player) => player.socketID !== socket.id)[0];
			socket.to(opponent.socketID).emit("chess-move", move);
		}
	});
	socket.on("create-match", () => {
		console.log("Create match request received");

		const matchId = randomMatchId();
		activeMatches[matchId] = {
			id: matchId,
			players: [
				{
					id: "1",
					color: "white",
					socketID: socket.id,
				},
			],
		};
		socket.emit("match-created", activeMatches[matchId]);
	});

	socket.on("start-match", (matchId: string) => {
		// console.log(`Start match request received: ${matchId}`);
		const match = activeMatches[matchId];
		if (match) {
			socket.emit("match-started", match);
			let opponent = match.players.filter((player) => player.socketID !== socket.id)[0];
			socket.to(opponent.socketID).emit("match-started", match);
		}
	});

	socket.on("get-match", (matchId: string) => {
		const match = activeMatches[matchId];
		if (match) {
			socket.emit("match-found", match);
		} else {
			socket.emit("match-not-found");
		}
	});

	socket.on("join-match", (matchId: string) => {
		console.log(`Join match request received: ${matchId}`);
		const match = activeMatches[matchId];
		if (match) {
			match.players.push({
				id: "2",
				color: "black",
				socketID: socket.id,
			});
			socket.emit("match-joined", match);
			let opponent = match.players.filter((player) => player.socketID !== socket.id)[0];
			socket.to(opponent.socketID).emit("match-joined", match);
		} else {
			socket.emit("match-not-found");
		}
	});
}

function randomMatchId() {
	return Math.random().toString(36).substring(2, 15);
}
