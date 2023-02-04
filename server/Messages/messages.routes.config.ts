import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import messagesController from "./controller/messages.controller";
import messagesMiddleware from "./middleware/messages.middleware";
import usersMiddleware from "../Users/middleware/users.middleware";

export default class MessageRoutes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {

        this.router.route("/")
            .post(
                body("from").isString(),
                body("to").isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                messagesController.createMessage
            )
            .patch(
                body("messageID").isString(),
                body("from").isString(),
                body("message").isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                messagesMiddleware.isIDValid,
                messagesMiddleware.validateMessageIDExist,
                messagesController.addMessage
            );

        this.router.param("userID", usersMiddleware.extractUserId);

        this.router.route("/:userID")
            .get(
                usersMiddleware.isIDValid,
                messagesController.listMessages
            );
    }
};