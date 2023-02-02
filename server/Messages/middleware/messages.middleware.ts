import express from 'express';
import mongooseService from '../../common/services/mongoose.service';
import messagesDao from '../daos/messages.dao';

const ObjectID = mongooseService.mongoose.Types.ObjectId;


class MessagesMiddleware {

    //Validation middleware 
    async validateMessageIDExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const message = await messagesDao.getMessage({ _id: req.body.messageID });
        if (!message) {
            res.status(400).send({ error: `message does not exist` });
        } else {
            next();
        }
    }

    async isIDValid(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (ObjectID.isValid(req.body.messageID)) {
            next();
        } else {
            res.status(400).send({ error: `Not a valid message ID` });
        }
    }

    async extractMessageId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.messageID = req.params.messageID;
        next();
    }
}

export default new MessagesMiddleware();
