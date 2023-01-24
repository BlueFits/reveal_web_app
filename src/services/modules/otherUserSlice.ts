import { createSlice } from '@reduxjs/toolkit'
import { IUserReducer } from './userSlice';

export interface apiTempUser extends Partial<IUserReducer> { }

const initialState: apiTempUser = {
    _id: null,
    preference: null,
    username: null,
    socketID: null,
    __v: null,
    avatar: {
        bg: null,
        display: null,
    }
};

// Then, handle actions in your reducers:
const otherUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearState: (state) => {
            console.log("cleared other user state");
            state.__v = null;
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
            state.__v = action.payload.__v;
            state._id = action.payload._id;
            state.preference = action.payload.preference;
            state.socketID = action.payload.socketID;
            state.username = action.payload.username;
            state.avatar.bg = action.payload.avatar.bg;
            state.avatar.display = action.payload.avatar.display;
        }
    },
    extraReducers: (builder) => {

    }
})

export const {
    clearState,
    setOtherUser,
} = otherUserSlice.actions;

export default otherUserSlice;