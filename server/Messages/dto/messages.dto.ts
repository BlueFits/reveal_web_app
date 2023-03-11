import { IUserReducer } from "../../../src/services/modules/User/userSlice"

export interface IMessageSingle {
    sender: IUserReducer | string;
    message: string;
    timestamp?: Date;
    isSending?: boolean;
}

export interface CreateMessageDto {
    _id?: string;
    members: Array<IUserReducer | string>;
    messages: Array<IMessageSingle> | [];
}

export interface PutMessageDto {
    members: Array<IUserReducer | string>;
    messages: Array<IMessageSingle>;

}

export interface PatchMessageDto extends Partial<PutMessageDto> { };