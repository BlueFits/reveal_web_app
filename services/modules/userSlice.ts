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
    id: string;
    username: string,
    socketID: string;
    preference: Array<string>;
    status: tempUserStatus.WAITING;
    _id?: string;
    __v?: number;
}

const initialState: IUserReducer = {
    id: null,
    username: null,
    socketID: null,
    preference: null,
    status: null,
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

export const updateStatus: any = createAsyncThunk("user/update", async (data: any, { getState }) => {
    try {
        const state: IUserReducer = (getState()! as IReducer).user;
        const response = await fetch(serverURL + `/api/temp_user/${state.id}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: data,
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
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createTempUser.fulfilled, (state, action: { payload: IMongoTempUser }) => {
            //If possible fix the socket duplication in the future
            if (action.payload.err === apiErrors.socketIdExsists) return;
            console.log("setting temp user reducer to", action.payload);
            const { username, preference, socketID, _id, status } = action.payload;
            state.username = username;
            state.preference = preference;
            state.socketID = socketID;
            state.id = _id;
            state.status = status;
        });
        builder.addCase(updateStatus.fulfilled, (state, action: { payload: IMongoTempUser }) => {
            console.log("setting new status of user to:", action.payload.status);
            state.status = action.payload.status;
        });
    }
})

export const {
    setPreference,
    setUsername,
    setSocketID,
} = userSlice.actions;

export default userSlice;