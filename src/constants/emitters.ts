import { IMessageSingle } from "../../server/Messages/dto/messages.dto";
import { CreateUserDto } from "../../server/Users/dto/users.dto";

export interface IJoinChatData {
    messageRoomID: string;
    userSocketID: string
}

export interface ISendIDChat {
    userSocket: string;
    otherUserSocket: string;
}

export interface ISendMsgChat {
    otherSocketID: string;
    message: IMessageSingle;
}

enum socketEmitters {
    REQUEST_ID = "requestid",
    CALLUSER = "calluser",
    CALLACCEPTED = "callaccepted",
    ME = "me",
    DISCONNECT = "disconnect",
    ANSWER_CALL = "answercall",
    REJECT_CALL = "rejectcall",
    REVEAL_INIT = "revealinit",
    REVEAL_ACCEPT = "revealaccept",
    ACCEPT_REVEAL = "acceptreveal",
    JOIN_ROOM = "join_room",
    ROOM_FULL = "roomfull",
    USER_CONNECTED = "user-connected",
    USER_DISCONNECTED = "user-disconnected",
    ROOM_LEAVE = "roomleave",
    MATCH_INIT = "matchinit",
    MATCH_ACCEPT = "matchaccept",
    ACCEPT_MATCH = "acceptmatch",
    JOIN_CHAT = "join_chat",
    USER_CONNECTED_ROOM = "user_connected_room",
    SEND_ID_CHAT = "send_id_chat",
    RECEIVE_ID_CHAT = "RECEIVE_ID_CHAT",
    SEND_MSG_CHAT = "SEND_MSG_CHAT",
    RECEIVE_MSG_CHAT = "RECEIVE_MSG_CHAT",
}

export default socketEmitters;