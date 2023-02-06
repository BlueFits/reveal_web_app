import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverURL } from "../../../config/Server";
import { CreateSocketRoomDTO } from '../../../server/socketRoom/dto/SocketRoom.dto';
import { gender } from '../../../server/Users/dto/users.dto';
import { addAllResultProp } from './common/utils.common';

export interface IRoomReducer extends Partial<CreateSocketRoomDTO> {
    _id: string | null;
}

const initialState: IRoomReducer = {
    _id: null,
    createdBy: null,
    showMe: null,
    openRoom: null,
};

const API = "/api/socket_room";

const parseChatType = (chatType: string) => {
    if (chatType === "0") return false;
    if (chatType === "1") return true;
}

//Thunks
export const findRoom: any = createAsyncThunk("room/findSim", async (data: {
    showMe: gender,
    gender: gender,
    roomID?: string | null,
    openRoom: string,
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
                openRoom: parseChatType(data.openRoom),
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
    openRoom: string
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
            openRoom: parseChatType(data.openRoom),
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
        builder.addCase(findRoom.fulfilled, addAllResultProp);
        builder.addCase(createRoom.fulfilled, addAllResultProp)
        builder.addCase(removeRoom.fulfilled, (state) => {
            state._id = null;
            state.createdBy = null;
            state.showMe = null;
            state.openRoom = null;
        });
    }
})

export const {

} = roomSlice.actions;

export default roomSlice;