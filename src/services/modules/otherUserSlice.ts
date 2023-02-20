import { createSlice } from '@reduxjs/toolkit'
import { IUserReducer } from './User/userSlice';

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
    },
    opener: null,
    picture: null,
    auth0: null,
    interests: null,
    isTrial: null,
};

// Then, handle actions in your reducers:
const otherUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearState: (state) => {
            for (const prop in state) {
                state[prop] = null;
            }
            state.avatar = {
                bg: null,
                display: null,
            };
        },
        setOtherUser: (state, action: { payload: apiTempUser }) => {
            for (const prop in action.payload) {
                if (state.hasOwnProperty(prop)) {
                    state[prop] = action.payload[prop];
                }
            }
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