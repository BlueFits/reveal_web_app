import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../../config/Server";
import avatarSimple from '../../constants/avatar';

enum apiErrors {
    socketIdExsists = "SocketID already exists",
}

interface IMongoTempUser extends Partial<IUserReducer> {
    err?: apiErrors.socketIdExsists,
}

export interface IUserReducer {
    socketID: string,
    username: string,
    preference: Array<string>;
    _id: string;
    __v?: number;
    avatar: {
        bg: string;
        display: string;
    }
}

const initialState: IUserReducer = {
    _id: null,
    socketID: null,
    username: null,
    preference: null,
    avatar: {
        bg: null,
        display: null,
    }
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername: (state, action: { payload: string }) => {
            state.username = action.payload;
        },
        setPreference: (state, action: { payload: Array<string> }) => {
            state.preference = action.payload;
        },
        setSocketID: (state, action: { payload: string }) => {
            state.socketID = action.payload;
        },
        setAvatar: (state) => {
            const avatar = {
                bg: avatarSimple.bg[Math.floor(Math.random() * avatarSimple.bg.length)],
                display: avatarSimple.display[Math.floor(Math.random() * avatarSimple.display.length)],
            }
            console.log("my avater", avatar);
            state.avatar = avatar;
        }
    },
    extraReducers: (builder) => {

    }
})

export const {
    setPreference,
    setUsername,
    setSocketID,
    setAvatar,
} = userSlice.actions;

export default userSlice;