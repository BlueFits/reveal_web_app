import express, { Request, Response } from "express";

class Ml5Controller {
    async testRoute(req: Request, res: Response) {
        res.status(200).send({ data: "route handled" });
    }
}

export default new Ml5Controller();