import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../config/Server";
import { tempUserStatus } from '../../server/tempUser/dto/create.tempUser.dto';
import { IReducer } from "../store";

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

//Thunks
export const createTempUser: any = createAsyncThunk("user/createTemp", async (data: any) => {
    try {
        const response = await fetch(serverURL + "/api/temp_user", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                socketID: data.socketID,
                preference: data.preference,
            }),
        });
        if (!response.ok) {
            const errData = await response.json();
            return { err: errData.error };
        } else {
            const resData = await response.json();
            return resData;
        }
    } catch (err) {
        throw err;
    }
});

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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createTempUser.fulfilled, (state, action: { payload: IMongoTempUser }) => {
            //If possible fix the socket duplication in the future
            if (action.payload.err === apiErrors.socketIdExsists) return;
            console.log("setting temp user reducer to", action.payload);
            const { username, preference, _id, avatar } = action.payload;
            state.username = username;
            state.preference = preference;
            state.avatar.bg = avatar.bg;
            state.avatar.display = avatar.display;
            state._id = _id
        });
    }
})

export const {
    setPreference,
    setUsername,
    setSocketID,
} = userSlice.actions;

export default userSlice;