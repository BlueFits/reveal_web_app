"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_routes_config_1 = require("../common/common.routes.config");
const express_1 = __importDefault(require("express"));
const tempUsers_controller_1 = __importDefault(require("./controllers/tempUsers.controller"));
const tempUsers_middleware_1 = __importDefault(require("./middleware/tempUsers.middleware"));
const express_validator_1 = require("express-validator");
const body_validation_middleware_1 = __importDefault(require("../common/middleware/body.validation.middleware"));
class TempUserRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(name) {
        super(name, express_1.default.Router());
    }
    configureRoute() {
        this.router.route("/")
            .get(tempUsers_controller_1.default.listUsers)
            .post((0, express_validator_1.body)("preference").exists().isArray(), (0, express_validator_1.body)("username").isString(), (0, express_validator_1.body)("socketID").exists().isString(), body_validation_middleware_1.default.verifyBodyFieldsErrors, tempUsers_middleware_1.default.validateSameSocketIdDoesntExist, tempUsers_controller_1.default.createUser);
        this.router.param("tempUserID", tempUsers_middleware_1.default.extractUserId);
        this.router.route("/:tempUserID")
            .all(tempUsers_middleware_1.default.validateUserExists)
            .get(tempUsers_controller_1.default.getTempUserByID)
            .delete(tempUsers_controller_1.default.removeUser);
        this.router.route("/:tempUserID/preference_match")
            .all(tempUsers_middleware_1.default.validateUserExists)
            .post((0, express_validator_1.body)("preference").exists().isArray(), body_validation_middleware_1.default.verifyBodyFieldsErrors, tempUsers_controller_1.default.getTempUserWithSamePref);
    }
}
exports.default = TempUserRoutes;
;
