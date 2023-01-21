import express from "express";
import mongoose from 'mongoose';
import socketRoomDao from "../dao/socketRoom.dao";

class SocketRoomMiddleware {
    async extractRoomID(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const ObjectID = mongoose.Types.ObjectId
        if (!ObjectID.isValid(req.params.roomID)) {
            res.status(400).send({
                error: `Invalid ID`,
            });
        } else {
            req.body.id = req.params.roomID;
            next();
        }
    }

    async validateIDExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const room = await socketRoomDao.getRoomByID(req.params.roomID)
        if (room) {
            next();
        } else {
            res.status(404).send({
                error: `Room ${req.params.roomID} not found`,
            });
        }
    }
}

export default new SocketRoomMiddleware();