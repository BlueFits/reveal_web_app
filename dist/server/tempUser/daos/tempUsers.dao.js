"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_service_1 = __importDefault(require("../../common/services/mongoose.service"));
class TempUsersDao {
    constructor() {
        this.Schema = mongoose_service_1.default.mongoose.Schema;
        this.tempUserSchema = new this.Schema({
            preference: [String],
            username: String,
            socketID: { type: String, required: true },
        });
        this.TempUser = mongoose_service_1.default.mongoose.model('TempUsers', this.tempUserSchema);
        console.log("Created new instance of TempUser");
    }
    async addTempUser(userFields) {
        const tempUser = new this.TempUser({
            ...userFields,
            "expireAt": { type: Date, expires: "12h" },
        });
        const newTempUser = await tempUser.save().catch(err => err);
        return newTempUser;
    }
    async getUserByID(userID) {
        return this.TempUser.findOne({ _id: userID }).exec();
    }
    async getTempUsers({ limit = 25, page = 0, filter = {} }) {
        return this.TempUser.find(filter)
            .limit(limit)
            .skip(limit * page)
            .exec();
    }
    async updateTempUserByID(userID, userFields) {
        const existingTempUser = await this.TempUser.findOneAndUpdate({ _id: userID }, { $set: userFields }, { new: true }).exec();
        return existingTempUser;
    }
    async removeTempUserByID(id) {
        return this.TempUser.deleteOne({ _id: id }).exec();
    }
    async removeTempUserBySocketID(socketID) {
        return this.TempUser.deleteOne({ socketID: socketID }).exec();
    }
    async getTempUserBySocketID(socketID) {
        return this.TempUser.findOne({ socketID }).exec();
    }
}
;
exports.default = new TempUsersDao;
