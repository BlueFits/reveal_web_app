"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tempUsers_dao_1 = __importDefault(require("../daos/tempUsers.dao"));
class TempUsersController {
    async listUsers(req, res) {
        const tempUsers = await tempUsers_dao_1.default.getTempUsers({
            limit: 100,
            page: 0,
        });
        res.status(200).send(tempUsers);
    }
    async getTempUserWithSamePref(req, res) {
        const preferenceArr = req.body.preference;
        //If preference contains at least one value from preferenceArr
        const tempUsers = await tempUsers_dao_1.default.getTempUsers({
            filter: { preference: { $in: preferenceArr } }
        });
        res.status(200).send(tempUsers);
    }
    async getTempUserByID(req, res) {
        const tempUser = await tempUsers_dao_1.default.getUserByID(req.body.id);
        res.status(200).send(tempUser);
    }
    async createUser(req, res) {
        const tempUser = await tempUsers_dao_1.default.addTempUser(req.body);
        res.status(201).send(tempUser);
    }
    async removeUser(req, res) {
        const removedUser = await tempUsers_dao_1.default.removeTempUserByID(req.body.id);
        /* Send a 204 no content */
        res.status(204).send(removedUser);
    }
}
;
exports.default = new TempUsersController();
