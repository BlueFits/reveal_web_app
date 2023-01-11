import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import tempUsersController from "./controllers/tempUsers.controller";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

export default class TempUserRoutes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .get(tempUsersController.listUsers)
            .post(
                body("preference").exists().isArray(),
                body("username").isString(),
                body("socketID").exists().isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                tempUsersController.createUser
            );
    }
};