import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice, { IUserReducer } from './modules/userSlice';

export interface IReducer {
  user: any,
}

const reducerObject: IReducer = {
  user: userSlice.reducer,
};

const reducer = combineReducers(reducerObject);

export const store = configureStore({
  reducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
