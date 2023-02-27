import mongoose from "mongoose";
import db_url from "../../config/db_url";

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    };
    private mongoDB = db_url;

    constructor() {
        this.connectWithRetry();
    }

    get mongoose() {
        return mongoose;
    }

    connectWithRetry() {
        mongoose.set('strictQuery', false)
        mongoose
            .connect(this.mongoDB, this.mongooseOptions)
            .then(() => {
                console.log("MongoDB is connected");
            })
            .catch((err) => {
                const retrySeconds = 5;
                console.error(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    }
};

export default new MongooseService();