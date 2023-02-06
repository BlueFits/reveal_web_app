import { IRoomReducer } from "../roomSlice";
import { IUserReducer } from "../User/userSlice";

export const addAllResultProp = (state, action): IUserReducer | IRoomReducer => {
    console.log("Working");
    for (const prop in action.payload) {
        if (state.hasOwnProperty(prop)) {
            state[prop] = action.payload[prop];
        }
    }
    return state;
};