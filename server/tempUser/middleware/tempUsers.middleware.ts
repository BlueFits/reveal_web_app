import express from 'express';
import debug from 'debug';
import tempUsersDao from '../daos/tempUsers.dao';

const log: debug.IDebugger = debug('app:users-controller');
class UsersMiddleware {

    //Validation middleware 
    // Here we need to use an arrow function to bind `this` correctly

    async validateSameSocketIdDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await tempUsersDao.getTempUserBySocketID(req.body.socketID);
        if (user) {
            res.status(400).send({ error: `SocketID already exists` });
        } else {
            next();
        }
    }

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await tempUsersDao.getUserByID(req.params.tempUserID)
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.tempUserID} not found`,
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.tempUserID;
        next();
    }
}

export default new UsersMiddleware();
