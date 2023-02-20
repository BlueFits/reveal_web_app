import express from 'express';
import usersDao from '../daos/users.dao';
import mongooseService from '../../common/services/mongoose.service';

const ObjectID = mongooseService.mongoose.Types.ObjectId;


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

    async validateSameUsernameDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const username = req.body.username;
        if (!username) {
            next();
        } else {
            const user = await usersDao.findUser({ username });
            if (user) {
                res.status(400).send({ error: `Username already exists` });
            } else {
                next();
            }
        }
    }

    async usernameNotBlank(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const username = req.body.username;
        if (!username) {
            next();
        } else {
            if (username === "") {
                res.status(400).send({ error: `Username cannot be blank` });
            } else {
                next();
            }
        }
    }

    async isIDValid(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (ObjectID.isValid(req.params.userID)) {
            next();
        } else {
            res.status(400).send({ error: `Not a valid user ID` });
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
