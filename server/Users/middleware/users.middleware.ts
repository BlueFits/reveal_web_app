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

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userID;
        next();
    }
}

export default new UsersMiddleware();
