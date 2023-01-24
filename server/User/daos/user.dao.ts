import mongooseService from "../../common/services/mongoose.service";
import { CreateUserDto, PatchUserDto, PutUserDto } from "../dto/user.dto";

class UsersDao {
    Schema = mongooseService.mongoose.Schema;
    userSchema = new this.Schema({
        username: String,
        birthday: { type: Date },
        gender: { type: String, enum: ["m", "f", "o"] },
        preference: { type: String, enum: ["m", "f", "o"] },
        picture: { type: String, required: false, default: "" },
        auth0: {
            created_at: String,
            email: String,
            email_verified: Boolean,
            identities: [
                {
                    connection: String,
                    provider: String,
                    user_id: String,
                    isSocial: Boolean,
                }
            ],
            name: String,
            nickname: String,
            picture: String,
            updated_at: String,
            user_id: String,
            last_ip: String,
            last_login: String,
            logins_count: Number,
        },
    });

    User = mongooseService.mongoose.model("Users", this.userSchema);

    constructor() { console.log("Initializing User Schema") }

    async addUser(userFields: CreateUserDto) {
        const user = new this.User({
            ...userFields,
        });
        const newUser = await user.save().catch(err => err);
        return newUser._id;
    }

    async getUserByAuth0Email(email: string) {
        return this.User.findOne({ "auth0.email": email }).exec();
    }

    async getUserById(userId: string) {
        // return this.User.findOne({ _id: userId }).populate('users').exec();
        return this.User.findOne({ _id: userId }).exec();
    }

    async getUsers(limit = 25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();

        return existingUser;
    }

    async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }
};

export default new UsersDao;