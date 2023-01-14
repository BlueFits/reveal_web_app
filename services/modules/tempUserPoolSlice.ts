import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../config/Server";

export interface apiTempUser {
    _id: string;
    preference: Array<string>;
    username: string;
    socketID: string;
    __V: number
}

export interface ITempUserPool {
    tempUsers: Array<apiTempUser>;
    err?: any;
}

const initialState: ITempUserPool = {
    tempUsers: [],
};

export const genTempUserPool: any = createAsyncThunk("user/gen25TempUserPool", async (data: any) => {
    try {
        const tempUsers = await fetch(serverURL + `/api/temp_user/preference_match`, {
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
            // const errData = await tempUsers.json();
            // return { err: errData.error };
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
const tempUserPoolSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(genTempUserPool.fulfilled, (state, action: { payload: Array<apiTempUser> }) => {
            console.log("setting tempuserpool to:", action.payload);
            state.tempUsers = action.payload;
        });
    }
})

export const {

} = tempUserPoolSlice.actions;

export default tempUserPoolSlice;