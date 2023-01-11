"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_url_1 = __importDefault(require("../../config/db_url"));
class MongooseService {
    constructor() {
        this.count = 0;
        this.mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        };
        this.mongoDB = process.env.MONGODB_URI || db_url_1.default;
        this.connectWithRetry();
    }
    get mongoose() {
        return mongoose_1.default;
    }
    connectWithRetry() {
        mongoose_1.default
            .connect(this.mongoDB, this.mongooseOptions)
            .then(() => {
            console.log("MongoDB is connected");
        })
            .catch((err) => {
            const retrySeconds = 5;
            console.error(`MongoDB connection unsuccessful (will retry #${++this
                .count} after ${retrySeconds} seconds):`, err);
            setTimeout(this.connectWithRetry, retrySeconds * 1000);
        });
    }
}
;
exports.default = new MongooseService();
