import mongooseService from "../../common/services/mongoose.service";
import { CreateFeedbackDto } from "../dto/feedback.dto";

class UsersDao {
    Schema = mongooseService.mongoose.Schema;
    feedbackSchema = new this.Schema({
        experience: { type: Number, required: true },
        wouldRecommend: { type: Number, required: true },
        additionalFeedback: String,
    });


    Feedback = mongooseService.mongoose.model("Feedback", this.feedbackSchema);

    constructor() { console.log("Initializing Feedback Schema") }

    async addFeedback(feedbackFields: CreateFeedbackDto) {
        try {
            const user = new this.Feedback({
                ...feedbackFields,
            });
            const newFeedback = await user.save().catch(err => err);
            return newFeedback;
        } catch (err) {
            throw err;
        }
    }

    async getFeedback(limit = 25, page = 0) {
        return this.Feedback.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }
};

export default new UsersDao;