import { Request, Response } from "express";
import userDao from "../daos/users.dao";

class UsersController {
    async listUsers(req: Request, res: Response) {
        const users = await userDao.getUsers();
        res.status(200).send(users);
    }

    async createUser(req: Request, res: Response) {
        console.log(req.body);
        const user = await userDao.addUser(req.body);
        res.status(201).send({ user });
    }

    async getUserByEmail(req: Request, res: Response) {
        const email: string = req.params.email;
        const user = await userDao.getUserByAuth0Email(email);
        res.status(200).send(user);
    }
}

export default new UsersController();