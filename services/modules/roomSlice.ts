import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../config/Server";
import { CreateSocketRoomDTO } from '../../server/socketRoom/dto/SocketRoom.dto';

export interface IRoomReducer extends Partial<CreateSocketRoomDTO> {
    _id: string | null;
}

const initialState: IRoomReducer = {
    _id: null,
    preference: null,
};

const API = "/api/socket_room";

//Thunks
export const findRoom: any = createAsyncThunk("room/findSim", async (data: any) => {
    try {
        console.log("Un processed data: ", data);
        const response = await fetch(`${serverURL}${API}/preference_match`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                preference: data,
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

export const createRoom: any = createAsyncThunk("room/create", async (data: any) => {
    const response = await fetch(`${serverURL}${API}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            preference: data
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

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(findRoom.fulfilled, (state, action: { payload: IRoomReducer }) => {
            //If possible fix the socket duplication in the future
            console.log("setting roomSlice reducer to", action.payload);
            state._id = action.payload._id;
            state.preference = action.payload.preference;
        });
        builder.addCase(createRoom.fulfilled, (state, action: { payload: IRoomReducer }) => {
            console.log("setting new created room reducer to", action.payload);
            state._id = action.payload._id;
            state.preference = action.payload.preference;
        })
    }
})

export const {

} = roomSlice.actions;

export default roomSlice;