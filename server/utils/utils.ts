import basicAuth from 'express-basic-auth'
import express from "express";

export const enableLock = (server: express.Application) => {
    server.use(basicAuth({
        challenge: true,
        users: {
            'admin': 'Kanto1234'
        }
    }))
    server.get("/", (req, res) => {
        res.redirect("/dashboard")
    });
}