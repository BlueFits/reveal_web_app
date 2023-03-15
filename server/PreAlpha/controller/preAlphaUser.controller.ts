import { Request, Response } from "express";
import PreAlphaUserDao from "../daos/preAlphaUser.dao";

class PreAlphaUser {

    async createPreAlphaUser(req: Request, res: Response) {
        const preAlphaUser = await PreAlphaUserDao.addPreAlphaUser(req.body);
        res.status(201).send({ preAlphaUser });
    }

};

export default new PreAlphaUser();