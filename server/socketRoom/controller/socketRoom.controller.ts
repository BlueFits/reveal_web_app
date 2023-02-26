import { Request, Response } from "express";
import { gender } from "../../Users/dto/users.dto";
import socketRoomDao from "../dao/socketRoom.dao";
import { CreateSocketRoomDTO } from "../dto/SocketRoom.dto";

class SocketRoomController {

    async listRooms(req: Request, res: Response) {
        const rooms = await socketRoomDao.getRooms({});
        res.status(200).send(rooms);
    }

    async createUser(req: Request, res: Response) {
        const socketRoom = await socketRoomDao.addRoom({
            showMe: req.body.showMe,
            createdBy: req.body.gender,
            openRoom: req.body.openRoom || false,
            interests: req.body.interests || [],
        });
        res.status(201).send(socketRoom);
    }

    async removeRoom(req: Request, res: Response) {
        const removedRoom = await socketRoomDao.removeRoomByID(req.body.id);
        res.status(204).send(removedRoom);
    }

    async getRoomWithSamePref(req: Request, res: Response) {
        const roomID = req.body.roomID;

        let room = null;
        let roomWithInterest = null;

        console.log(req.body);

        if (req.body.openRoom) {

            room = await socketRoomDao.getRooms({
                filter: { "_id": { $ne: roomID }, openRoom: true }
            });

        } else {

            const filterDefault: { [key: string]: any } = {
                "_id": { $ne: roomID },
                showMe: req.body.gender,
                createdBy: req.body.showMe,
                openRoom: false,
            };

            if (req.body.interests && req.body.interests.length > 0) {
                const filterInterest: { [key: string]: any } = {
                    "_id": { $ne: roomID },
                    showMe: req.body.gender,
                    createdBy: req.body.showMe,
                    openRoom: false,
                    interests: { $in: req.body.interests }
                };
                roomWithInterest = await socketRoomDao.getRooms({
                    filter: filterInterest,
                });
            }

            room = await socketRoomDao.getRooms({
                filter: filterDefault,
            });
        }

        if (roomWithInterest && roomWithInterest.length > 0) {
            res.status(200).send(roomWithInterest[0]);
        } else if (room.length === 0) {
            res.status(404).send(null);
        } else {
            res.status(200).send(room[0]);
        }
    }

};

export default new SocketRoomController();