import mongooseService from '../../common/services/mongoose.service';
import { CreatePrelaunchUser } from '../dto/prelaunchUser.dto';

class PrelaunchUser {
    private Schema = mongooseService.mongoose.Schema;
    private PrelaunchUserSchema = new this.Schema({
        email: String,
    });
    private PrelaunchUser = mongooseService.mongoose.model('PrelaunchUser', this.PrelaunchUserSchema);

    constructor() { console.log("Initializing PrelaunPrelaunchUserchCollect") }

    /* Getters */

    get PrelaunchUserModel() {
        return this.PrelaunchUser;
    }

    /* CRUD  */

    async addPrelaunchUser(userFields: CreatePrelaunchUser) {
        try {
            const user = new this.PrelaunchUser({
                ...userFields,
            });
            const newPrelaunchUser = await user.save().catch(err => err);
            return newPrelaunchUser;
        } catch (err) {
            throw err;
        }
    }
};

export default new PrelaunchUser;