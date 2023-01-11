import mongooseService from '../../common/services/mongoose.service';
import { CreateTempUserDTO } from "../dto/create.tempUser.dto";
import { PatchTempUserDTO } from '../dto/patch.tempUser.dto copy';
import { PutTempUserDTO } from '../dto/put.tempUser.dto';

class TempUsersDao {
    Schema = mongooseService.mongoose.Schema;
    tempUserSchema = new this.Schema({
        preference: [String],
        username: String,
        socketID: { type: String, required: true },
    });

    TempUser = mongooseService.mongoose.model('TempUsers', this.tempUserSchema);

    constructor() { console.log("Created new instance of TempUser") }

    async addTempUser(userFields: CreateTempUserDTO) {
        const tempUser = new this.TempUser({
            ...userFields,
            "expireAt": { type: Date, expires: "12h" },
        });
        const newTempUser = await tempUser.save().catch(err => err);
        return newTempUser._id;
    }

    async getUserByID(userID: string) {
        return this.TempUser.findOne({ _id: userID }).exec();
    }

    async getTempUsers({
        limit = 25,
        page = 0,
        filter = {}
    }: {
        limit?: number,
        page?: number,
        filter?: any,
    }) {
        return this.TempUser.find(filter)
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateTempUserByID(userID: string, userFields: PatchTempUserDTO | PutTempUserDTO) {
        const existingTempUser = await this.TempUser.findOneAndUpdate(
            { _id: userID },
            { $set: userFields },
            { new: true },
        ).exec();

        return existingTempUser;
    }

    async removeTempUserByID(id: string) {
        return this.TempUser.deleteOne({ _id: id }).exec();
    }
};

export default new TempUsersDao;