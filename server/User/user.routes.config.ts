import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

export default class UserRoutes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .get()
    }
};