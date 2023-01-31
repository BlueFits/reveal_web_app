import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CreateMessageDto } from '../../../../server/Messages/dto/messages.dto';
import MessagesApi from './api';

export interface IMessageReducer {
    messages: Array<CreateMessageDto>;
};

const initialState: IMessageReducer = {
    messages: [],
};


export const reloadMessages: any = createAsyncThunk("user/reloadMessages", async (userID: string) => {
    try {
        const response = await MessagesApi.reloadMessages(userID);
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

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(reloadMessages.fulfilled, (state, action: { payload: Array<CreateMessageDto> }) => {
            state.messages = action.payload;
        });
    }
})

export const {

} = messageSlice.actions;

export default messageSlice;