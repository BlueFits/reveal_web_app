import express from "express";

export abstract class CommonRoutesConfig {
    protected name: string;
    protected router: express.Router;

    constructor(name: string, router: express.Router) {
        this.name = name;
        this.router = router;
        this.configureRoute();
    }

    abstract configureRoute(): void;

    get getName() {
        return this.name;
    }

    get getRouter() {
        return this.router;
    }

};