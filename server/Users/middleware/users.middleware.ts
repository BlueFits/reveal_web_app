import express from 'express';
import usersDao from '../daos/users.dao';

class UsersMiddleware {

    //Validation middleware 
    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await usersDao.getUserByAuth0Email(req.body.auth0.email);
        if (user) {
            res.status(400).send({ error: `User email already exists` });
        } else {
            next();
        }
    }

    // async validateUserExists(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     const user = await userService.readById(req.params.userId);
    //     if (user) {
    //         next();
    //     } else {
    //         res.status(404).send({
    //             error: `User ${req.params.userId} not found`,
    //         });
    //     }
    // }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();
