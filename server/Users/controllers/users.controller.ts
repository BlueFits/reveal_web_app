import { Request, Response } from "express";
import usersDao from "../daos/users.dao";
import userDao from "../daos/users.dao";

class UsersController {
    async listUsers(req: Request, res: Response) {
        const users = await userDao.getUsers();
        res.status(200).send(users);
    }

    async createUser(req: Request, res: Response) {
        const user = await userDao.addUser(req.body);
        res.status(201).send({ user });
    }

    async getUserByEmail(req: Request, res: Response) {
        const email: string = req.params.email;
        const user = await userDao.getUserByAuth0Email(email);
        res.status(200).send(user);
    }

    async getUserByAuth0ID(req: Request, res: Response) {
        const id = req.body.id;
        const user = await userDao.getUserByAuth0ID(id);
        res.status(200).send(user);
    }

    async updateUserByID(req: Request, res: Response) {
        const id = req.body.id;
        let user = null;
        if (req.body.matches) {
            user = await usersDao.addToMatches(id, req.body.matches);
        } else {
            user = await usersDao.updateUserById(id, req.body);
        }
        res.status(200).send(user);
    }

    async delete(req: Request, res: Response) {
        const id = req.body.id;
        if (req.body.delete) {
            console.log("delted whole user", req.body);
            const user = await userDao.removeUserById(id);
            res.status(204).send(user);
        } else {
            console.log("delted prop");
            const user = await userDao.removeDocFromArrayProp(id, req.body);
            res.status(200).send(user);
        }
    }
}

export default new UsersController();