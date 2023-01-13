import { Request, Response } from "express";
import tempUsersDao from "../daos/tempUsers.dao";
import { tempUserStatus } from "../dto/create.tempUser.dto";

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
        console.log(preferenceArr);
        //If preference contains at least one value from preferenceArr
        const tempUsers = await tempUsersDao.getTempUsers({
            filter: { preference: { $in: preferenceArr }, status: tempUserStatus.WAITING }
        })
        res.status(200).send(tempUsers);
    }

    async getTempUserByID(req: Request, res: Response) {
        const tempUser = await tempUsersDao.getUserByID(req.body.id)
        res.status(200).send(tempUser)
    }

    async createUser(req: Request, res: Response) {
        const tempUser = await tempUsersDao.addTempUser(req.body)
        res.status(201).send(tempUser);
    }

    async removeUser(req: Request, res: Response) {
        const removedUser = await tempUsersDao.removeTempUserByID(req.body.id);
        /* Send a 204 no content */
        res.status(204).send(removedUser);
    }

    async patch(req: Request, res: Response) {
        await tempUsersDao.updateTempUserByID(req.body.id, req.body);
        res.status(204).send();
    }
};

export default new TempUsersController();