import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import prelaunchUserController from "./controller/prelaunchUser.controller";

export default class PreLaunchUserRoutes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .post(
                body("email").isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                prelaunchUserController.createPrelaunchUser
            )
    }
};