import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../config/Server";

enum apiErrors {
    socketIdExsists = "SocketID already exists",
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

const extractUser = (data) => {
    const { username, preference, socketID, _id: id } = data;
    return { username, preference, socketID, id };
}

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

// Then, handle actions in your reducers:
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
        builder.addCase(createTempUser.fulfilled, (state, action) => {
            //If possible fix the socket duplication in the future
            if (action.payload.err === apiErrors.socketIdExsists) return;
            //CAUTION - setting state to action payload like so state = {} leaves out isReady avoid if possible
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