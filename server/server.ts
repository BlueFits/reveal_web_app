import next from 'next'
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
//Router
import Ml5Routes from "./ml5/ml5.routes.config";
//constants
import { socketEmitters } from "../constants/emitters"


const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server: express.Application = express();
const httpServer = createServer(server)
const io = new Server(httpServer, { cors: { origin: '*', methods: [ "GET", "POST" ] } });
const ml5Router = new Ml5Routes("Ml5Routes").getRouter;


app.prepare().then(() => {

	if (dev) {
		server.use(morgan("dev"));
	}
	server.use(express.json());
	server.use(cors());
	server.use(cookieParser());

	server.use("/ml5", ml5Router);

	//Connects NextJS application
	server.all("*", (req: express.Request, res: express.Response) => {
		return handle(req, res);
	});

	io.on('connection', (socket) => {
		console.log('Connection established');

		socket.emit(socketEmitters.ME, socket.id);

		socket.on("disconnect", () => {
			socket.broadcast.emit(socketEmitters.CALLENDED);
		})

		socket.on("calluser", ({ userToCall, signal, from, name }) => {
			io.to(userToCall).emit(socketEmitters.CALLUSER, { signal, from, name });
		});

		socket.on("answercall", (data) => {
			io.to(data.to).emit(socketEmitters.CALLACCEPTED, data.signal);
		});
	});

	httpServer.listen(port, () => {
		// our only exception to avoiding console.log(), because we
		// always want to know when the server is done starting up
		console.log(
			`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
			}`
		)
	})
})
