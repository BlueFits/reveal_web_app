import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import feedbacksController from "./controllers/feedbacks.controller";

export default class FeedbackRoutes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .get(feedbacksController.listFeedbacks)
            .post(
                body("experience").isNumeric(),
                body("wouldRecommend").isNumeric(),
                body("additionalFeedback").isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                feedbacksController.createFeedback
            );
    }
};