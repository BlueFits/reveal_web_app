"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketInstance_1 = __importDefault(require("./utils/socketInstance"));
//Router
const tempUsers_routes_config_1 = __importDefault(require("./tempUser/tempUsers.routes.config"));
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const server = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(server);
const io = new socket_io_1.Server(httpServer, { cors: { origin: '*', methods: ["GET", "POST"] } });
// const ml5Router = new Ml5Routes("Ml5Routes").getRouter;
const tempUserRouter = new tempUsers_routes_config_1.default("TempUserRoutes").getRouter;
app.prepare().then(() => {
    if (dev) {
        server.use((0, morgan_1.default)("dev"));
    }
    server.use(express_1.default.json());
    server.use((0, cors_1.default)());
    server.use((0, cookie_parser_1.default)());
    server.use("/api/temp_user", tempUserRouter);
    server.all("*", (req, res) => {
        return handle(req, res);
    });
    new socketInstance_1.default(io);
    httpServer.listen(port, () => {
        // our only exception to avoiding console.log(), because we
        // always want to know when the server is done starting up
        console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
    });
});
