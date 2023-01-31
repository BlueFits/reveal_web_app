import { Request, Response } from "express";
import messagesDao from "../daos/messages.dao";
import { CreateMessageDto } from "../dto/messages.dto";

class MessagesController {
    async listMessages(req: Request, res: Response) {
        if (req.query.with) {
            const messages = await messagesDao.getMessage({
                members: [
                    req.body.id,
                    req.query.with,
                ]
            });
            !messages ? res.status(404).send("No messages") : res.status(200).send(messages);
        } else {
            const messages = await messagesDao.getMessages({ "members": { $in: [req.body.id] } });
            !messages ? res.status(404).send("No messages") : res.status(200).send(messages);
        }
    }

    async createMessage(req: Request, res: Response) {
        const data: { from: string; to: string, message: string } = req.body;
        const message = await messagesDao.createMessage({
            members: [data.from, data.to],
            messages: [{
                sender: data.from,
                message: data.message,
            }],
        });
        res.status(201).send(message);
    }

    async addMessage(req: Request, res: Response) {
        const data: { from: string; message: string, messageID: string } = req.body;
        const msg = await messagesDao.addToMessage(data.messageID, data.from, data.message);
        res.status(200).send(msg);
    }
}

export default new MessagesController();