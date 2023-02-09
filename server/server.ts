import next from 'next'
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import SocketInstance from './utils/socketUtils/socketInstance';
import { auth, requiresAuth } from "express-openid-connect";
import { enableLock } from './utils/utils';
//Config
import Auth0Config from '../config/Auth0.config';

//Router
import SocketRoom from './socketRoom/socketRoom.routes.config';
import UserRoutes from './Users/user.routes.config';
import MessageRoutes from './Messages/messages.routes.config';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server: express.Application = express();
const httpServer = createServer(server);
const io = new Server(httpServer, { cors: { origin: '*', methods: ["GET", "POST"] } });
const availableSocketRoomRouter = new SocketRoom("SocketRoomRoutes").getRouter;
const usersRouter = new UserRoutes("UserRoutes").getRouter;
const messageRouter = new MessageRoutes("MessageRoutes").getRouter;

app.prepare().then(() => {

	if (dev) {
		server.use(morgan("dev"));
	}
	server.use(express.json());
	server.use(cors());
	server.use(cookieParser());
	server.use(auth(Auth0Config))

	server.use("/api/socket_room", availableSocketRoomRouter);
	server.use("/api/users", usersRouter);
	server.use("/api/messages", messageRouter);

	// enableLock(server);

	server.get("/profile", requiresAuth(), (req, res) => {
		res.send(JSON.stringify(req.oidc.user));
	});

	server.all("*", (req: express.Request, res: express.Response) => {
		return handle(req, res);
	});

	new SocketInstance(io);

	httpServer.listen(port, () => {
		// our only exception to avoiding console.log(), because we
		// always want to know when the server is done starting up
		console.log(
			`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`
		)
	})
})
