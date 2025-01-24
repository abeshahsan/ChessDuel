import { Server, Socket } from "socket.io";

type Match = {
	id: string;
	players: {
		id: string;
		color: string;
		socketID: string;
	}[];
};

let activeMatches: { [matchId: string]: Match } = {};

export function addSocketEvents(socket: Socket) {
	socket.on("message", (message: string) => {
		console.log(`Message received: ${message}--${socket.id}`);
		socket.broadcast.emit("message", "Hello from server");
	});

	socket.on("chess-move", (move: {}) => {
		console.log(`Chess move received: ${JSON.stringify(move)}`);
		socket.broadcast.emit("chess-move", move);
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
}

function randomMatchId() {
	return Math.random().toString(36).substring(2, 15);
}
