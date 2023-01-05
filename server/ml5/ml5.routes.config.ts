import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import ml5Controller from "./controllers/ml5.controller";

class Ml5Routes extends CommonRoutesConfig {
    constructor(name: string) {
        super(name, express.Router());
    }

    configureRoute(): void {
        this.router.route("/")
        .get(ml5Controller.testRoute);
    }
}

export default Ml5Routes;