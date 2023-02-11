import { serverURL } from "../../../../config/Server";
import { CreateFeedbackDto } from "../../../../server/Feedback/dto/feedback.dto";

const API = "/api/feedback"

const feedbackAPI = {
    async createFeedback({ additionalFeedback, experience, wouldRecommend }: CreateFeedbackDto) {
        return await fetch(`${serverURL}${API}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                experience,
                wouldRecommend,
                additionalFeedback
            }),
        });
    },
};

export default feedbackAPI;