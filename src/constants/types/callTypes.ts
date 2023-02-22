import { IUserReducer } from "../../services/modules/User/userSlice";

/* Socket Connection types */

export interface callUserData {
    toCallID: string,
    signal: any,
    user: IUserReducer
}

export interface acceptCallData {
    userAccepting: IUserReducer,
    signal: any,
    socketID: string;
}