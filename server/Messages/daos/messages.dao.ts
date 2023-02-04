import mongooseService from "../../common/services/mongoose.service";
import { CreateMessageDto, PatchMessageDto, PutMessageDto } from "../dto/messages.dto";

class MessagesDao {
    Schema = mongooseService.mongoose.Schema;

    messageSchema = new this.Schema({
        members: [{ type: this.Schema.Types.ObjectId, ref: "Users" }],
        messages: [{
            sender: { type: this.Schema.Types.ObjectId, ref: "Users" },
            message: String,
            timestamp: { type: Date, default: Date.now }
        }],
    });

    Message = mongooseService.mongoose.model("Messages", this.messageSchema);

    constructor() { console.log("Initializing Message Schema") }

    //CR UD
    async createMessage(userFields: CreateMessageDto) {
        try {
            const message = new this.Message({
                ...userFields,
            });
            const newMessage = await message.save().catch(err => err);
            return newMessage;
        } catch (err) {
            throw err;
        }
    }

    async getMessages(filter: Object = {}) {
        return this.Message.find(filter).select({
            "messages": { "$slice": -1 }
        }).populate("members").exec();
    }

    async addToMessage(messageID: string, senderID: string, message: string) {
        const existingMessage = await this.Message.findOneAndUpdate(
            { _id: messageID },
            { $push: { messages: [{ sender: senderID, message }] } },
            { new: true }
        ).populate("members").exec();
        return existingMessage;
    }

    async getMessage(filter) {
        return this.Message.findOne(filter).limit(25).populate("members").exec();
    }
};

export default new MessagesDao;