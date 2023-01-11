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

    async createUser(req: Request, res: Response) {
        const userID = await tempUsersDao.addTempUser(req.body)
        res.status(201).send({ id: userID });
    }
};

export default new TempUsersController();