"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRoutesConfig = void 0;
class CommonRoutesConfig {
    constructor(name, router) {
        this.name = name;
        this.router = router;
        this.configureRoute();
    }
    get getName() {
        return this.name;
    }
    get getRouter() {
        return this.router;
    }
}
exports.CommonRoutesConfig = CommonRoutesConfig;
;
