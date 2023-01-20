import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";

export default class SocketRoom extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
            .get((req, res) => res.send("salut"))
    }
};