import { Request, Response } from "express";
import socketRoomDao from "../dao/socketRoom.dao";

type preferences = Array<string>;

class SocketRoomController {

    async listRooms(req: Request, res: Response) {
        const rooms = await socketRoomDao.getRooms({});
        res.status(200).send(rooms);
    }

    async createUser(req: Request, res: Response) {
        const socketRoom = await socketRoomDao.addRoom({ preference: req.body.preference });
        res.status(201).send(socketRoom);
    }

    async removeRoom(req: Request, res: Response) {
        const removedRoom = await socketRoomDao.removeRoomByID(req.body.id);
        res.status(204).send(removedRoom);
    }

    async getRoomWithSamePref(req: Request, res: Response) {
        const preferenceArr: preferences = req.body.preference;
        const roomID = req.body.roomID;
        const room = await socketRoomDao.getRooms({
            filter: { "_id": { $ne: roomID }, preference: { $in: preferenceArr } }
        });
        if (room.length == 0) {
            res.status(404).send(null);
        } else {
            res.status(200).send(room[0]);
        }
    }

};

export default new SocketRoomController();