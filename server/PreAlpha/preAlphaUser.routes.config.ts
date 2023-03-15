import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import PreAlphaUserController from "./controller/preAlphaUser.controller";

export default class PreAlphaUserRoutes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .post(
                body("email").isString().isEmail(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                PreAlphaUserController.createPreAlphaUser
            )
    }
};