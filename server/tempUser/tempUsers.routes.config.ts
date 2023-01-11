import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import tempUsersController from "./controllers/tempUsers.controller";
import tempUsersMiddleware from "./middleware/tempUsers.middleware";
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
                tempUsersMiddleware.validateSameSocketIdDoesntExist,
                tempUsersController.createUser
            );

        this.router.param("tempUserID", tempUsersMiddleware.extractUserId);

        this.router.route("/:tempUserID")
            .all(tempUsersMiddleware.validateUserExists)
            .get(tempUsersController.getTempUserByID)
            .delete(tempUsersController.removeUser)

        this.router.route("/:tempUserID/preference_match")
            .all(tempUsersMiddleware.validateUserExists)
            .post(
                body("preference").exists().isArray(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                tempUsersController.getTempUserWithSamePref
            );

    }
};