import mongooseService from '../../common/services/mongoose.service';
import { CreateSocketRoomDTO } from "../dto/SocketRoom.dto";

class SocketRoom {
    Schema = mongooseService.mongoose.Schema;
    socketRoomSchema = new this.Schema({
        preference: [String],
        roomID: String,
    });
    SocketRoom = mongooseService.mongoose.model('SocketRooms', this.socketRoomSchema);

    constructor() { console.log("Initializing SocketRooms") }

    /* CRUD  */

    async addRoom(userFields: CreateSocketRoomDTO) {
        const socketRoom = new this.SocketRoom({
            ...userFields,
        });
        const newSR = await socketRoom.save().catch(err => err);
        return newSR;
    }

    async getRoomByID(roomID: string) {
        return this.SocketRoom.findOne({ _id: roomID }).exec();
    }

    async getRoom({
        filter = {}
    }) {
        return this.SocketRoom.findOne(filter).exec();
    }

    async getRooms({
        filter = {},
        limit = 50,
        page = 0
    }: {
        limit?: number,
        page?: number,
        filter?: any,
    }) {
        return this.SocketRoom.find(filter)
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async removeRoomByID(id: string) {
        return this.SocketRoom.deleteOne({ _id: id }).exec();
    }
};

export default new SocketRoom;