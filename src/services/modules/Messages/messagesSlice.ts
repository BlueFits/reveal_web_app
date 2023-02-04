import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CreateMessageDto, IMessageSingle } from '../../../../server/Messages/dto/messages.dto';
import MessagesApi from './api';

export interface IMessageReducer {
    messages: Array<CreateMessageDto>;
};

const initialState: IMessageReducer = {
    messages: [],
};


export const reloadMessages: any = createAsyncThunk("message/reloadMessages", async (userID: string) => {
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

export const deepMessageReload: any = createAsyncThunk("message/deepReload", async (data: { userID: string, otherUserID: string }) => {
    try {
        const response = await MessagesApi.deepMessageReload(data.userID, data.otherUserID);
        if (!response.ok) {
            const errData = await response.json();
            console.error("my err", errData);
            return null;
        } else {
            const resData = await response.json();
            return resData;
        }
    } catch (err) {
        throw err;
    }
});

export const initiateMessage: any = createAsyncThunk("message/initiateMessage", async (data: { userID: string, otherUserID: string }) => {
    try {
        const response = await MessagesApi.initiateMsg(data.userID, data.otherUserID);
        if (!response.ok) {
            const error = await response.json();
            throw error;
        } else {
            const initiateSuccess: CreateMessageDto = await response.json();
            return initiateSuccess;
        }
    } catch (err) {
        throw err;
    }
});

export const sendMessage: any = createAsyncThunk("message/sendMessage", async ({ messageID, userID, msg }: { messageID: string, userID: string, msg: string }) => {
    try {
        const response = await MessagesApi.sendMsg(messageID, userID, msg);
        if (!response.ok) {
            const errData = await response.json();
            throw errData;
        } else {
            const resData: CreateMessageDto = await response.json();
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
        pushMsg: (state, action: { payload: { messageID: string, messageInstance: IMessageSingle } }) => {
            for (let i = 0; i < state.messages.length; i++) {
                if (state.messages[i]._id === action.payload.messageID) {
                    state.messages[i].messages = [...state.messages[i].messages, action.payload.messageInstance];
                    break;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(reloadMessages.fulfilled, (state, action: { payload: Array<CreateMessageDto> }) => {
            state.messages = action.payload;
        });
        builder.addCase(deepMessageReload.fulfilled, (state, action: { payload: CreateMessageDto }) => {
            for (let i = 0; i < state.messages.length; i++) {
                if (state.messages[i]._id === action.payload._id) {
                    state.messages[i] = action.payload;
                    break;
                }
            }
        });
        builder.addCase(initiateMessage.fulfilled, (state, action: { payload: CreateMessageDto }) => {
            state.messages = [...state.messages, action.payload];
        });
        builder.addCase(sendMessage.fulfilled, (state, action: { payload: CreateMessageDto }) => {
            for (let i = 0; i < state.messages.length; i++) {
                if (state.messages[i]._id === action.payload._id) {
                    state.messages[i] = action.payload;
                    break;
                }
            }
        });
    }
})

export const {
    pushMsg,
} = messageSlice.actions;

export default messageSlice;