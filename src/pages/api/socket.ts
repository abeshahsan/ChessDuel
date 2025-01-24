import { Server as IOServer, Socket } from "socket.io";
import { NextApiRequest } from "next";
import { addSocketEvents } from "./socket_events";

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
		console.log(`Socket.io client connected [id=${socket.id}]`);
		addSocketEvents(socket);
	});

	res.socket.server.io = io;

	res.end();
}
