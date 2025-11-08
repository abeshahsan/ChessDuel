import { Socket } from "socket.io";
import { Chess, Move } from "chess.js";
import { customAlphabet } from "nanoid";

// Types
type Player = {
	id: string;
	name: string;
	email?: string;
	image?: string;
	color: "white" | "black";
	socketID: string;
};

type MatchStatus = "pending" | "ready" | "started" | "finished" | "cancelled";

type Match = {
	id: string;
	createdAt: Date;
	expiresAt?: Date; // only when pending
	status: MatchStatus;
	players: Player[]; // [host, opponent?]
	started?: boolean;
	fen?: string;
	turn?: "w" | "b";
	history?: string[];
	// internal engine (not sent to clients)
	_engine?: Chess;
};

type persistenSocketIDs = {
	[clientId: string]: string;
};

export const allClientIDs: persistenSocketIDs = {};

// In-memory storage (ephemeral; suitable for dev/demo)
const activeMatches: Record<string, Match> = {};
const matchExpiryTimers: Record<string, NodeJS.Timeout> = {};

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 10);

function randomMatchId() {
	return nanoid(); // 10-char unambiguous short ID
}

function scheduleExpiry(matchId: string, minutes = 10, onExpire: () => void) {
	if (matchExpiryTimers[matchId]) clearTimeout(matchExpiryTimers[matchId]);
	matchExpiryTimers[matchId] = setTimeout(onExpire, minutes * 60 * 1000);
}

function clearExpiry(matchId: string) {
	if (matchExpiryTimers[matchId]) {
		clearTimeout(matchExpiryTimers[matchId]);
		delete matchExpiryTimers[matchId];
	}
}

// Note: If broadcasting to rooms is desired, we can use socket.server.sockets.in(matchId).emit(...)

export function addSocketEvents(socket: Socket) {
	// Basic message
	socket.on("message", (message: string) => {
		console.log(`Message received: ${message}--${socket.id}`);
		socket.broadcast.emit("message", "Hello from server");
	});

	// Create a match (auth required via provided userInfo)
	socket.on("create-match", (userInfo: any) => {
		if (!userInfo?.userId || !userInfo?.userName) {
			socket.emit("unauthorized", { reason: "Missing user info" });
			return;
		}

		const matchId = randomMatchId();
		const now = new Date();
		const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
		const match: Match = {
			id: matchId,
			createdAt: now,
			expiresAt,
			status: "pending",
			players: [
				{
					id: userInfo.userId,
					name: userInfo.userName,
					email: userInfo.userEmail,
					image: userInfo.userImage,
					color: "white",
					socketID: socket.id,
				},
			],
			started: false,
			fen: new Chess().fen(),
			turn: "w",
			history: [],
		};
		activeMatches[matchId] = match;
		console.log("Match created:", matchId, "by", userInfo.userName);

		// schedule expiry if no opponent joins
		scheduleExpiry(matchId, 10, () => {
			const m = activeMatches[matchId];
			if (!m) return;
			if (m.status === "pending" && m.players.length === 1) {
				m.status = "cancelled";
				socket.emit("match-expired", { id: matchId });
				delete activeMatches[matchId];
				clearExpiry(matchId);
				console.log("Match expired:", matchId);
			}
		});

		// Place host in a room named by matchId for isolation
		try { socket.join(matchId); } catch {}

		socket.emit("match-created", match);
	});

	// Get a match by ID
	socket.on("get-match", (matchId: string) => {
		if (!matchId) {
			socket.emit("match-not-found");
			return;
		}
		console.log(`Get match request for: ${matchId}`);
		const match = activeMatches[matchId];
		if (match) {
			socket.emit("match-found", match);
		} else {
			socket.emit("match-not-found");
		}
	});

	// Join a match (auth required)
	socket.on("join-match", (matchId: string, userInfo: any) => {
		if (!userInfo?.userId || !userInfo?.userName) {
			socket.emit("unauthorized", { reason: "Missing user info" });
			return;
		}
		console.log(`Join match ${matchId} requested by ${userInfo.userName}`);
		const match = activeMatches[matchId];
		if (!match) {
			socket.emit("match-not-found");
			return;
		}
		// Expired or cancelled
		if (match.status === "cancelled" || (match.expiresAt && new Date() > match.expiresAt)) {
			socket.emit("match-expired", { id: matchId });
			delete activeMatches[matchId];
			clearExpiry(matchId);
			return;
		}
		// Already started/finished
		if (match.status === "started" || match.status === "finished") {
			socket.emit("match-already-started", { id: matchId });
			return;
		}
		// Prevent self-join
		if (match.players[0]?.id === userInfo.userId) {
			socket.emit("self-join-blocked");
			return;
		}
		// If this user is already in the match as opponent (rejoin), update socket and emit joined
		const existingIdx = match.players.findIndex((p) => p.id === userInfo.userId);
		if (existingIdx >= 0) {
			match.players[existingIdx].socketID = socket.id;
			try { socket.join(matchId); } catch {}
			// Ensure status reflects readiness when two players exist
			if (match.players.length === 2) match.status = "ready";
			socket.emit("match-joined", match);
			const other = match.players.find((_, idx) => idx !== existingIdx);
			if (other?.socketID) socket.to(other.socketID).emit("match-joined", match);
			return;
		}

		// Full for new user
		if (match.players.length >= 2) {
			socket.emit("match-full");
			return;
		}

		// Host info is already stored server-side at create time

		// Add opponent
		const opponent: Player = {
			id: userInfo.userId,
			name: userInfo.userName,
			email: userInfo.userEmail,
			image: userInfo.userImage,
			color: "black",
			socketID: socket.id,
		};
		match.players.push(opponent);
		match.status = "ready";
		clearExpiry(matchId); // no longer pending-only

		try { socket.join(matchId); } catch {}

		// Notify both players
		socket.emit("match-joined", match);
		// Notify host
		const host = match.players[0];
		if (host?.socketID && host.socketID !== socket.id) {
			socket.to(host.socketID).emit("match-joined", match);
		}
	});

	// Start the match (idempotent)
	socket.on("start-match", (matchId: string) => {
		const match = activeMatches[matchId];
		if (!match) {
			socket.emit("match-not-found");
			return;
		}
		if (match.status !== "ready" || match.players.length !== 2) {
			socket.emit("match-not-ready");
			return;
		}
		if (match.started) {
			socket.emit("match-started", match); // idempotent feedback
			return;
		}

		match.status = "started";
		match.started = true;
		match._engine = new Chess();
		match.fen = match._engine.fen();
		match.turn = match._engine.turn();
		match.history = [];
		// Notify both players with initial board state
		socket.emit("match-started", match);
		const other = match.players.find((p) => p.socketID !== socket.id);
		if (other?.socketID) socket.to(other.socketID).emit("match-started", match);
	});

	// Moves only when started and from participant
	socket.on("chess-move", (matchID: string, move: { from: string; to: string; promotion?: string }) => {
		const match = activeMatches[matchID];
		if (!match || match.status !== "started") return;
		if (!match._engine) match._engine = new Chess(match.fen);

		// Determine mover color by socket
		const me = match.players.find((p) => p.socketID === socket.id);
		if (!me) return;
		const myColor = me.color === "white" ? "w" : "b";
		if (match._engine.turn() !== myColor) {
			socket.emit("invalid-move", { reason: "Not your turn" });
			return;
		}

		// Try to make the move
		const result = match._engine.move({ from: move.from, to: move.to, promotion: move.promotion || "q" });
		if (!result) {
			socket.emit("invalid-move", { reason: "Illegal move" });
			return;
		}

		// Update authoritative state
		match.fen = match._engine.fen();
		match.turn = match._engine.turn();
		match.history = match._engine.history();

		// Finished detection
		let finishedPayload: any = undefined;
		if (match._engine.isGameOver()) {
			match.status = "finished";
			if (match._engine.isCheckmate()) finishedPayload = { result: "checkmate", winner: match.turn === "w" ? "black" : "white" };
			else if (match._engine.isDraw()) finishedPayload = { result: "draw" };
			else finishedPayload = { result: "finished" };
		}

		const opponent = match.players.find((p) => p.socketID !== socket.id);
		const payload = {
			id: match.id,
			fen: match.fen,
			turn: match.turn,
			history: match.history,
			lastMove: {
				from: result.from,
				to: result.to,
				san: result.san,
				piece: result.piece,
				captured: result.captured,
				color: myColor,
			},
			status: match.status,
			finished: finishedPayload,
		};

		// Emit authoritative state to both players
		socket.emit("match-state", payload);
		if (opponent?.socketID) socket.to(opponent.socketID).emit("match-state", payload);
	});

	// Offer a draw to the opponent
	socket.on("offer-draw", (matchID: string) => {
		const match = activeMatches[matchID];
		if (!match || match.status !== "started") return;
		const me = match.players.find((p) => p.socketID === socket.id);
		if (!me) return;
		const opponent = match.players.find((p) => p.socketID !== socket.id);
		if (!opponent?.socketID) return;
		socket.to(opponent.socketID).emit("draw-offer", { matchId: matchID, from: me.id, fromName: me.name });
	});

	// Respond to a draw offer
	socket.on("respond-draw", (matchID: string, accept: boolean) => {
		const match = activeMatches[matchID];
		if (!match || match.status !== "started") return;
		const me = match.players.find((p) => p.socketID === socket.id);
		if (!me) return;
		const opponent = match.players.find((p) => p.socketID !== socket.id);
		if (!opponent?.socketID) return;

		if (!accept) {
			// Inform offerer declined
			socket.to(opponent.socketID).emit("draw-declined", { matchId: matchID, by: me.id, byName: me.name });
			return;
		}

		// Accept -> finish as draw
		match.status = "finished";
		const payload = {
			id: match.id,
			fen: match.fen,
			turn: match._engine?.turn() ?? match.turn,
			history: match._engine?.history() ?? match.history,
			status: match.status,
			finished: { result: "draw", reason: "agreed" },
		};
		socket.emit("match-state", payload);
		socket.to(opponent.socketID).emit("match-state", payload);
	});

	// Resign (quit) current game
	socket.on("resign", (matchID: string) => {
		const match = activeMatches[matchID];
		if (!match || match.status !== "started") return;
		const me = match.players.find((p) => p.socketID === socket.id);
		if (!me) return;
		const opponent = match.players.find((p) => p.socketID !== socket.id);
		if (!opponent?.socketID) return;
		match.status = "finished";
		const winner = opponent.color; // opponent wins on resignation
		const payload = {
			id: match.id,
			fen: match.fen,
			turn: match._engine?.turn() ?? match.turn,
			history: match._engine?.history() ?? match.history,
			status: match.status,
			finished: { result: "resignation", winner },
		};
		socket.emit("match-state", payload);
		socket.to(opponent.socketID).emit("match-state", payload);
	});

	// Cancel match (host only, before start)
	socket.on("cancel_match", () => {
		const entry = Object.values(activeMatches).find((m) => m.players[0]?.socketID === socket.id && m.status !== "started");
		if (!entry) return;
		entry.status = "cancelled";
		const matchId = entry.id;
		clearExpiry(matchId);
		// Inform opponent if present
		if (entry.players[1]?.socketID) socket.to(entry.players[1].socketID).emit("match-cancelled", { id: matchId });
		delete activeMatches[matchId];
		socket.emit("match-cancelled", { id: matchId });
	});

	// Handle disconnects to update match state
	socket.on("disconnect", () => {
		// Find any match containing this socket
		const match = Object.values(activeMatches).find((m) => m.players.some((p) => p.socketID === socket.id));
		if (!match) return;
		const matchId = match.id;
		const leavingIdx = match.players.findIndex((p) => p.socketID === socket.id);

		if (match.status === "started") {
			// For now, just notify the opponent; reconnect flow is an enhancement
			const other = match.players.find((_, idx) => idx !== leavingIdx);
			if (other?.socketID) socket.to(other.socketID).emit("player-disconnected", { id: matchId });
			return;
		}

		// Pre-start cases
		if (match.status === "ready") {
			// Opponent left before start -> revert to pending
			if (leavingIdx === 1) {
				match.players.pop();
				match.status = "pending";
				match.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // give a few more minutes
				scheduleExpiry(matchId, 5, () => {
					const m = activeMatches[matchId];
					if (!m) return;
					if (m.status === "pending" && m.players.length === 1) {
						m.status = "cancelled";
						const host = m.players[0];
						if (host?.socketID) socket.to(host.socketID).emit("match-expired", { id: matchId });
						delete activeMatches[matchId];
						clearExpiry(matchId);
					}
				});
				const host = match.players[0];
				if (host?.socketID) socket.to(host.socketID).emit("opponent-left", match);
				return;
			}
		}

		// Host left before opponent joined -> keep pending for a few minutes
		if (match.status === "pending" && leavingIdx === 0) {
			// Nothing to notify (no opponent yet); expiry already scheduled
			return;
		}
	});
}
