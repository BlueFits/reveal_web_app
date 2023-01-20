import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../config/Server";
import { IReducer } from '../store';
import { IUserReducer } from './userSlice';

export interface apiTempUser {
    _id: string;
    preference: Array<string>;
    username: string;
    socketID: string;
    __V: number
    avatar: {
        bg: string;
        display: string;
    }
}

const initialState: apiTempUser = {
    _id: null,
    preference: null,
    username: null,
    socketID: null,
    __V: null,
    avatar: {
        bg: null,
        display: null,
    }
};

export const genTempUser: any = createAsyncThunk("user/genTempUser", async (data: any, { getState }) => {
    try {
        const state: IUserReducer = (getState()! as IReducer).user;
        const tempUsers = await fetch(serverURL + `/api/temp_user/${state.id}/preference_match`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                preference: data,
            }),
        });
        if (!tempUsers.ok) {
            console.error("genTempUserPool api error");
        } else {
            const resData = await tempUsers.json();
            console.log("recevied", resData);
            return resData;
        }
    } catch (err) {
        throw err;
    }
});

// Then, handle actions in your reducers:
const otherUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearState: (state) => {
            console.log("cleared other user state");
            state.__V = null;
            state._id = null;
            state.preference = null;
            state.socketID = null;
            state.username = null;
            state.avatar = {
                bg: null,
                display: null,
            }
        },
        setOtherUser: (state, action: { payload: apiTempUser }) => {
            state.__V = action.payload.__V;
            state._id = action.payload._id;
            state.preference = action.payload.preference;
            state.socketID = action.payload.socketID;
            state.username = action.payload.username;
            state.avatar.bg = action.payload.avatar.bg;
            state.avatar.display = action.payload.avatar.display;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(genTempUser.fulfilled, (state, action: { payload: apiTempUser }) => {
            console.log("setting other user to:", action.payload);
            if (!action.payload) {
                console.log("setting state to null");
                state.__V = null;
                state._id = null;
                state.preference = null;
                state.socketID = null;
                state.username = null;
                state.avatar.bg = null;
                state.avatar.display = null;
            } else {
                state.__V = action.payload.__V;
                state._id = action.payload._id;
                state.preference = action.payload.preference;
                state.socketID = action.payload.socketID;
                state.username = action.payload.username;
                state.avatar.bg = action.payload.avatar.bg;
                state.avatar.display = action.payload.avatar.display;
            }
        });
    }
})

export const {
    clearState,
} = otherUserSlice.actions;

export default otherUserSlice;