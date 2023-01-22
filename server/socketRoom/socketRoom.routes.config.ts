import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import { body } from "express-validator";
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

import socketRoomController from "./controller/socketRoom.controller";
import socketRoomMiddleware from "./middleware/socketRoom.middleware";

export default class SocketRoom extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .get(socketRoomController.listRooms)
            .post(
                body("preference").exists().isArray(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                socketRoomController.createUser
            );

        this.router.route("/preference_match")
            .post(
                body("preference").exists().isArray(),
                body("roomID").optional(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                socketRoomController.getRoomWithSamePref
            );

        this.router.param("roomID", socketRoomMiddleware.extractRoomID);

        this.router.route("/:roomID")
            .all(socketRoomMiddleware.validateIDExists)
            .delete(socketRoomController.removeRoom)
    }
};