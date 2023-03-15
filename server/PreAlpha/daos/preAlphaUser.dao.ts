import mongooseService from '../../common/services/mongoose.service';
import { CreatePreAlphaUser } from '../dto/preAlphaUser.dto';

class PreAlphaUser {
    private Schema = mongooseService.mongoose.Schema;
    private PreAlphaUserSchema = new this.Schema({
        email: String,
    });
    private PreAlphaUser = mongooseService.mongoose.model('PreAlphaUser', this.PreAlphaUserSchema);

    constructor() { console.log("Initializing PrelaunPreAlphaUserchCollect") }

    /* Getters */

    get PreAlphaUserModel() {
        return this.PreAlphaUser;
    }

    /* CRUD  */

    async addPreAlphaUser(userFields: CreatePreAlphaUser) {
        try {
            const user = new this.PreAlphaUser({
                ...userFields,
            });
            const newPreAlphaUser = await user.save().catch(err => err);
            return newPreAlphaUser;
        } catch (err) {
            throw err;
        }
    }
};

export default new PreAlphaUser;