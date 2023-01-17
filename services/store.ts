import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './modules/userSlice';
import otherUserSlice from './modules/otherUserSlice';

export interface IReducer {
  user: any,
  otherUser: any,
}

const reducerObject: IReducer = {
  user: userSlice.reducer,
  otherUser: otherUserSlice.reducer,
};

const reducer = combineReducers(reducerObject);

export const store = configureStore({
  reducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
