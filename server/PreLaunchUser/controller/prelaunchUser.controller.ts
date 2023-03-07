import { Request, Response } from "express";
import prelaunchUserDao from "../daos/prelaunchUser.dao";

class PreLaunchUser {

    async createPrelaunchUser(req: Request, res: Response) {
        const prelaunchUser = await prelaunchUserDao.addPrelaunchUser(req.body);
        res.status(201).send({ prelaunchUser });
    }

};

export default new PreLaunchUser();