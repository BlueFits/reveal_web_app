import { IUserReducer } from "../../../src/services/modules/User/userSlice"

export interface CreateMessageDto {
    members: Array<IUserReducer | string>;
    messages: [{
        sender: IUserReducer | string;
        message: string;
        timestamp?: Date;
    }];
}

export interface PutMessageDto {
    members: Array<IUserReducer | string>;
    messages: [{
        sender: IUserReducer | string;
        message: string;
        timestamp: Date;
    }];
}

export interface PatchMessageDto extends Partial<PutMessageDto> { };