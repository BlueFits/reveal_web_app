import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../config/Server";

enum apiErrors {
    socketIdExsists = "SocketID already exists",
}

interface apiUser {
    _id: string;
    preference: Array<string>;
    username: string;
    socketID: string;
    __V: number
}

interface ICreateTempUser extends Partial<IUserReducer> {
    err?: apiErrors.socketIdExsists,
    _id: string;
}

export interface IUserReducer {
    id: string;
    username: string,
    socketID: string;
    preference: Array<string>;
    isReady?: boolean;
}

const initialState: IUserReducer = {
    id: null,
    username: null,
    socketID: null,
    preference: null,
    isReady: false,
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
        },
        setIsReady: (state, action: { payload: boolean }) => {
            state.isReady = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createTempUser.fulfilled, (state, action: { payload: ICreateTempUser }) => {
            //If possible fix the socket duplication in the future
            if (action.payload.err === apiErrors.socketIdExsists) return;
            //CAUTION - setting state to action payload like so state = {} leaves out isReady avoid if possible
            console.log("setting temp user reducer to", action.payload);
            const { username, preference, socketID, _id } = action.payload;
            state.username = username;
            state.preference = preference;
            state.socketID = socketID;
            state.id = _id;
        })
    }
})

export const {
    setPreference,
    setUsername,
    setSocketID,
    setIsReady
} = userSlice.actions;

export default userSlice;