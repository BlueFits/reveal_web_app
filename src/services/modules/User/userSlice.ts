import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../../../config/Server";
import avatarSimple from '../../../constants/ui/avatar';
import { CreateUserDto, PatchUserDto, PutUserDto } from '../../../../server/Users/dto/users.dto';
import { gender } from '../../../../server/Users/dto/users.dto';
import UsersApi, { IUpdateUserByForm, IAddUserToMatches, IReloadMessages } from './api';

export interface IFormSet {
    username: string;
    birthday: Date,
    gender: gender,
    showMe: gender,
    matches?: Array<CreateUserDto> | [];
}

export interface IUserReducer extends PutUserDto {
    __v?: number;
    socketID: string,
    avatar: {
        bg: string;
        display: string;
    }
    isFirstTime: boolean;
    username: string;
    opener: string;
    isTrial: boolean;
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
    matches: null,
    avatar: {
        bg: null,
        display: null,
    },
    interests: null,
    auth0: null,
    opener: null,
    isFirstTime: true,
    isTrial: false,
};

export const getUserByEmail: any = createAsyncThunk("user/getUserByEmail", async (email: string) => {
    try {
        const response = await UsersApi.getUserByEmailPost(email);
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

export const getUserByAuthID: any = createAsyncThunk("user/getUserByAuthID", async (data: string) => {
    try {
        const response = await UsersApi.getUserByAuthID(data);
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

export const updateUserByForm: any = createAsyncThunk("user/updateUserByForm", async (data: IUpdateUserByForm) => {
    try {
        const response = await UsersApi.updateUserByForm(data)
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

export const addUserToMatches: any = createAsyncThunk("user/addUserToMatches", async (data: IAddUserToMatches) => {
    try {
        const response = await UsersApi.addUserToMatches(data);
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

export const updateUser: any = createAsyncThunk("user/updateUser", async ({ id, fields }: { id: string, fields: PatchUserDto }) => {
    try {
        const response = await UsersApi.updateUser({ id, fields });
        if (!response.ok) {
            const errData = await response.json();
            console.error("my err", errData);
            return errData;
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
        setTrialUser: (state, action: { payload: boolean }) => {
            state.isTrial = action.payload;
        },
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
            state.avatar = avatar;
        },
        formSet: (state, action: { payload: IFormSet }) => {
            for (const prop in action.payload) {
                if (state.hasOwnProperty(prop)) {
                    state[prop] = action.payload[prop];
                }
            }
        },
        setOpener: (state, action: { payload: string }) => {
            state.opener = action.payload;
        }
    },
    extraReducers: (builder) => {

        const addAllResultProp = (state, action): IUserReducer => {
            for (const prop in action.payload) {
                if (state.hasOwnProperty(prop)) {
                    state[prop] = action.payload[prop];
                }
            }
            return state;
        };

        const defaultAddAll = (state, action: { payload: CreateUserDto }) => {
            console.log("Action result", action.payload);
            state = addAllResultProp(state, action);
        };

        builder.addCase(updateUserByForm.fulfilled, defaultAddAll);
        builder.addCase(addUserToMatches.fulfilled, defaultAddAll);
        builder.addCase(getUserByAuthID.fulfilled, (state, action: { payload: CreateUserDto }) => {
            if (action.payload.gender) state.isFirstTime = false;
            state = addAllResultProp(state, action);
        });
        builder.addCase(getUserByEmail.fulfilled, (state, action: { payload: CreateUserDto }) => {
            if (action.payload.gender) state.isFirstTime = false;
            state = addAllResultProp(state, action);
        });
        builder.addCase(updateUser.fulfilled, (state, action: { payload: PutUserDto }) => {
            state = addAllResultProp(state, action);
        });
    }
})

export const {
    setTrialUser,
    setPreference,
    setUsername,
    setSocketID,
    setAvatar,
    formSet,
    setOpener
} = userSlice.actions;

export default userSlice;