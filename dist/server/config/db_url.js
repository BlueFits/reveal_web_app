"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AvailableENVs;
(function (AvailableENVs) {
    AvailableENVs["DEV"] = "dev";
})(AvailableENVs || (AvailableENVs = {}));
const db_url = {
    dev: "mongodb+srv://christianAdmin:mongopassword@cluster0.ubkpu.mongodb.net/reveal?retryWrites=true&w=majority"
};
exports.default = db_url[AvailableENVs.DEV];
