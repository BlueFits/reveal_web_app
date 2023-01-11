"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const tempUsers_dao_1 = __importDefault(require("../daos/tempUsers.dao"));
const log = (0, debug_1.default)('app:users-controller');
class UsersMiddleware {
    //Validation middleware 
    // Here we need to use an arrow function to bind `this` correctly
    async validateSameSocketIdDoesntExist(req, res, next) {
        const user = await tempUsers_dao_1.default.getTempUserBySocketID(req.body.socketID);
        if (user) {
            res.status(400).send({ error: `SocketID already exists` });
        }
        else {
            next();
        }
    }
    async validateUserExists(req, res, next) {
        const user = await tempUsers_dao_1.default.getUserByID(req.params.tempUserID);
        if (user) {
            next();
        }
        else {
            res.status(404).send({
                error: `User ${req.params.tempUserID} not found`,
            });
        }
    }
    async extractUserId(req, res, next) {
        req.body.id = req.params.tempUserID;
        next();
    }
}
exports.default = new UsersMiddleware();
