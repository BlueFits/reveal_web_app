import mongooseService from "../../common/services/mongoose.service";
import { CreateUserDto, PatchUserDto, PutUserDto } from "../dto/users.dto";

class UsersDao {
    Schema = mongooseService.mongoose.Schema;
    userSchema = new this.Schema({
        username: String,
        birthday: { type: Date },
        gender: { type: String, enum: ["m", "f", "o"] },
        preference: { type: String, enum: ["m", "f", "o"] },
        picture: { type: String, required: false, default: "" },
        auth0: {
            name: String,
            email: String,
            user_id: String,
            nickname: String,
            picture: String,
        },
    });


    User = mongooseService.mongoose.model("Users", this.userSchema);

    constructor() { console.log("Initializing User Schema") }

    async addUser(userFields: CreateUserDto) {
        try {
            const user = new this.User({
                ...userFields,
            });
            const newUser = await user.save().catch(err => err);
            return newUser;
        } catch (err) {
            throw err;
        }
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