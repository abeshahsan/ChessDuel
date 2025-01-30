import { Server as IOServer, Socket } from "socket.io";
import { NextApiRequest } from "next";
import { addSocketEvents, allClientIDs } from "./socket_events";

let io: IOServer;

export default function handler(req: NextApiRequest, res: any) {
	if (io) {
		res.end();
	}

	console.log("New Socket.io server...");

	io = new IOServer(res.socket.server, {
		path: "/api/socket",
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket: Socket) => {
		let id = socket.handshake.query.clientId as string;

		console.log(typeof id);

		if(!id) id = socket.id;

		allClientIDs[id] = socket.id;
		
		console.log(`Socket.io client connected with ID: ${id}`);
		addSocketEvents(socket);

		socket.on("disconnect", () => {
			console.log(`Socket.io client disconnected with ID: ${id}}`);
			delete allClientIDs[id];
		});
	});

	res.socket.server.io = io;

	res.end();
}
