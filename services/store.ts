import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './modules/userSlice';
import tempUserPoolSlice from './modules/tempUserPoolSlice';

export interface IReducer {
  user: any,
  tempUserPool: any,
}

const reducerObject: IReducer = {
  user: userSlice.reducer,
  tempUserPool: tempUserPoolSlice.reducer,
};

const reducer = combineReducers(reducerObject);

export const store = configureStore({
  reducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
