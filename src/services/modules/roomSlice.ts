import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../../config/Server";
import { CreateSocketRoomDTO } from '../../../server/socketRoom/dto/SocketRoom.dto';
import { gender } from '../../../server/Users/dto/users.dto';

export interface IRoomReducer extends Partial<CreateSocketRoomDTO> {
    _id: string | null;
}

const initialState: IRoomReducer = {
    _id: null,
    createdBy: null,
    showMe: null,
};

const API = "/api/socket_room";

//Thunks
export const findRoom: any = createAsyncThunk("room/findSim", async (data: {
    showMe: gender,
    gender: gender,
    roomID?: string | null
}) => {
    try {
        const response = await fetch(`${serverURL}${API}/preference_match`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                showMe: data.showMe,
                gender: data.gender,
                roomID: data.roomID || null,
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

export const createRoom: any = createAsyncThunk("room/create", async (data: {
    showMe: gender,
    gender: gender,
}) => {
    const response = await fetch(`${serverURL}${API}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            showMe: data.showMe,
            gender: data.gender,
        }),
    });
    if (!response.ok) {
        const errData = await response.json();
        console.error("error in room/create", errData);
    } else {
        const resData = await response.json();
        return resData;
    }
});

export const removeRoom: any = createAsyncThunk("room/remove", async (data: any) => {
    try {
        console.log(`sending to api ${serverURL}${API}/${data}`);
        const response = await fetch(`${serverURL}${API}/${data}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const errData = await response.json();
            console.error("error in room/delete", errData);
            throw errData;
        } else {
            const resData = await response.json();
            return resData;
        }
    } catch (err) {
        throw err;
    }
});

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(findRoom.fulfilled, (state, action: { payload: IRoomReducer }) => {
            //If possible fix the socket duplication in the future
            console.log("setting roomSlice reducer to", action.payload);
            state._id = action.payload._id;
            state.createdBy = action.payload.createdBy;
            state.showMe = action.payload.showMe;
        });
        builder.addCase(createRoom.fulfilled, (state, action: { payload: IRoomReducer }) => {
            console.log("setting new created room reducer to", action.payload);
            state._id = action.payload._id;
            state.createdBy = action.payload.createdBy;
            state.showMe = action.payload.showMe;
        })
        builder.addCase(removeRoom.fulfilled, (state) => {
            console.log("Remoing available room info");
            state._id = null;
            state.createdBy = null;
            state.showMe = null;
        });
    }
})

export const {

} = roomSlice.actions;

export default roomSlice;