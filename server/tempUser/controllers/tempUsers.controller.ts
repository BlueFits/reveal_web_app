import { Request, Response } from "express";
import tempUsersDao from "../daos/tempUsers.dao";
import { tempUserStatus } from "../dto/create.tempUser.dto";
import avatarSimple from "../../config/avatar";

type preferences = Array<string>;

class TempUsersController {
    async listUsers(req: Request, res: Response) {
        const tempUsers = await tempUsersDao.getTempUsers({
            limit: 100,
            page: 0,
        })
        res.status(200).send(tempUsers)
    }

    async getTempUserWithSamePref(req: Request, res: Response) {
        const preferenceArr: preferences = req.body.preference;
        const userID = req.body.id;
        if (!userID) res.status(400).send("No ID found")
        console.log("preference log", preferenceArr, userID);
        //If preference contains at least one value from preferenceArr
        const tempUser = await tempUsersDao.getTempUsers({
            filter: { "_id": { $ne: userID }, preference: { $in: preferenceArr }, status: tempUserStatus.WAITING }
        });
        // const randomIndex = Math.floor(Math.random() * (tempUsers.length));
        // const tempUser = tempUsers[0];
        res.status(200).send(tempUser);
    }

    async getTempUserByID(req: Request, res: Response) {
        const tempUser = await tempUsersDao.getUserByID(req.body.id)
        res.status(200).send(tempUser)
    }

    async createUser(req: Request, res: Response) {
        /* Generate a random avatar */
        const avatar = {
            bg: avatarSimple.bg[Math.floor(Math.random() * avatarSimple.bg.length)],
            display: avatarSimple.display[Math.floor(Math.random() * avatarSimple.display.length)],
        }
        const tempUser = await tempUsersDao.addTempUser({ ...req.body, avatar })
        res.status(201).send(tempUser);
    }

    async removeUser(req: Request, res: Response) {
        const removedUser = await tempUsersDao.removeTempUserByID(req.body.id);
        /* Send a 204 no content */
        res.status(204).send(removedUser);
    }

    async patch(req: Request, res: Response) {
        const updatedTempUser = await tempUsersDao.updateTempUserByID(req.body.id, req.body);
        res.status(200).send(updatedTempUser);
    }
};

export default new TempUsersController();