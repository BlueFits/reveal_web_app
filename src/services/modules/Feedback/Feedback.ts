import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CreateFeedbackDto } from '../../../../server/Feedback/dto/feedback.dto';
import feedbackAPI from './api';
import { addAllResultProp } from '../common/utils.common';

export interface IFeedback extends CreateFeedbackDto { }

const initialState: IFeedback = {
    additionalFeedback: null,
    experience: null,
    wouldRecommend: null,
};


export const createFeedback: any = createAsyncThunk("message/reloadMessages", async (data: CreateFeedbackDto) => {
    try {
        const response = await feedbackAPI.createFeedback(data);
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


const feedbackSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createFeedback.fulfilled, (state, action: { payload: { feedback: CreateFeedbackDto } }) => {
            console.log("return result", action.payload.feedback);
            for (const prop in action.payload.feedback) {
                if (state.hasOwnProperty(prop)) {
                    state[prop] = action.payload.feedback[prop];
                }
            }
        });
    }
})

export const {

} = feedbackSlice.actions;

export default feedbackSlice;