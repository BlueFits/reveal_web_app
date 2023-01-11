import { Request, Response } from "express";
import tempUsersDao from "../daos/tempUsers.dao";

type preference = Array<string>;

class TempUsersController {
    async listUsers(req: Request, res: Response) {
        const tempUsers = await tempUsersDao.getTempUsers({
            limit: 100,
            page: 0,
        })
        res.status(200).send(tempUsers)
    }

    async getTempUserByID(req: Request, res: Response) {
        const user = await tempUsersDao.getUserByID(req.body.id)
        res.status(200).send(user)
    }

    async createUser(req: Request, res: Response) {
        const userID = await tempUsersDao.addTempUser(req.body)
        res.status(201).send({ id: userID });
    }

    async removeUser(req: Request, res: Response) {
        const removedUser = await tempUsersDao.removeTempUserByID(req.body.id);
        /* Send a 204 no content */
        res.status(204).send(removedUser);
    }
};

export default new TempUsersController();