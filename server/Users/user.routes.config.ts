import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";
import { auth, requiresAuth } from "express-openid-connect";

export default class UserRoutes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .get(usersController.listUsers)
            .post(
                body("auth0").isObject(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                usersMiddleware.validateSameEmailDoesntExist,
                usersController.createUser
            )

        this.router.param("userID", usersMiddleware.extractUserId);

        this.router.route("/:userID")
            .get(
                usersController.getUserByAuth0ID
            )
            .patch(
                body("username").isString().optional(),
                body("birthday").toDate().optional(),
                body("gender").isString().optional(),
                body("showMe").isString().optional(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                usersMiddleware.isIDValid,
                usersController.updateUserByID,
            )
            .delete(
                body("matches").optional(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                usersMiddleware.isIDValid,
                usersController.delete,
            );

    }
};