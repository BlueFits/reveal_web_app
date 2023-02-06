import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface IliveCountReducer {
    liveCount: number | null;
}

const initialState: IliveCountReducer = {
    liveCount: null,
};

const liveCountSlice = createSlice({
    name: 'livecount',
    initialState,
    reducers: {
        updateCount: (state, action: { payload: number }) => {
            state.liveCount = action.payload;
        }
    },
    extraReducers: (builder) => {
    }
})

export const {
    updateCount,
} = liveCountSlice.actions;

export default liveCountSlice;