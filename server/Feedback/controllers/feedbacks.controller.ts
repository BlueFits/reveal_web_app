import { Request, Response } from "express";
import feedbackDao from "../daos/feedback.dao";

class UsersController {
    async listFeedbacks(req: Request, res: Response) {
        const feedbacks = await feedbackDao.getFeedback();
        res.status(200).send(feedbacks);
    }

    async createFeedback(req: Request, res: Response) {
        const feedback = await feedbackDao.addFeedback(req.body);
        res.status(201).send({ feedback });
    }
}

export default new UsersController();