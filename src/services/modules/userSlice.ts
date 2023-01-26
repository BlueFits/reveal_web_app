import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../../config/Server";
import avatarSimple from '../../constants/avatar';
import { CreateUserDto, PutUserDto } from '../../../server/Users/dto/users.dto';
import { gender } from '../../../server/Users/dto/users.dto';

interface IFormSet {
    username: string;
    birthday: Date,
    gender: gender,
    showMe: gender
}

export interface IUserReducer extends PutUserDto {
    __v?: number;
    socketID: string,
    avatar: {
        bg: string;
        display: string;
    }
    isFirstTime: boolean;
}


const initialState: IUserReducer = {
    _id: null,
    socketID: null,
    username: null,
    preference: null,
    birthday: null,
    gender: null,
    picture: null,
    showMe: null,
    avatar: {
        bg: null,
        display: null,
    },
    auth0: null,
    isFirstTime: true,
};

const API = "/api/users";

export const getUserByAuthID: any = createAsyncThunk("user/getUserByAuthID", async (data: string) => {
    try {
        const response = await fetch(`${serverURL}${API}/${data}`);
        if (!response.ok) {
            const errData = await response.json();
            console.error("my err", errData);
            throw errData;
        } else {
            const resData = await response.json();
            return resData;
        }
    } catch (err) {
        throw err;
    }
});

interface IUpdateUserByForm {
    _id?: string;
    id: string;
    birthday: Date;
    gender: gender;
    showMe: string;
    username: string;
}

export const updateUserByForm: any = createAsyncThunk("user/updateUserByForm", async (data: IUpdateUserByForm) => {
    try {
        const response = await fetch(`${serverURL}${API}/${data.id}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                gender: data.gender,
                showMe: data.showMe,
                birthday: data.birthday,
            }),
        });
        if (!response.ok) {
            const errData = await response.json();
            console.error("my err", errData);
            throw errData;
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
        setAvatar: (state) => {
            const avatar = {
                bg: avatarSimple.bg[Math.floor(Math.random() * avatarSimple.bg.length)],
                display: avatarSimple.display[Math.floor(Math.random() * avatarSimple.display.length)],
            }
            console.log("my avater", avatar);
            state.avatar = avatar;
        },
        formSet: (state, action: { payload: IFormSet }) => {
            for (const prop in action.payload) {
                if (state.hasOwnProperty(prop)) {
                    state[prop] = action.payload[prop];
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserByAuthID.fulfilled, (state, action: { payload: CreateUserDto }) => {
            if (action.payload.gender) state.isFirstTime = false;
            for (const prop in action.payload) {
                if (state.hasOwnProperty(prop)) {
                    state[prop] = action.payload[prop];
                }
            }
        });
        builder.addCase(updateUserByForm.fulfilled, (state, action: { payload: IUpdateUserByForm }) => {
            console.log('updateUser Payload', action.payload);
            for (const prop in action.payload) {
                if (state.hasOwnProperty(prop)) {
                    state[prop] = action.payload[prop];
                }
            }
        });
    }
})

export const {
    setPreference,
    setUsername,
    setSocketID,
    setAvatar,
    formSet,
} = userSlice.actions;

export default userSlice;