import { gender } from "../../Users/dto/users.dto";

export interface CreateSocketRoomDTO {
    openRoom?: boolean;
    showMe: gender;
    createdBy: gender;
    interests: [string];
}