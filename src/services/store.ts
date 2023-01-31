import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './modules/User/userSlice';
import otherUserSlice from './modules/otherUserSlice';
import roomSlice from "./modules/roomSlice";
import messageSlice from './modules/Messages/messagesSlice';

export interface IReducer {
  user: any;
  otherUser: any;
  room: any;
  messages: any;
}

const reducerObject: IReducer = {
  user: userSlice.reducer,
  otherUser: otherUserSlice.reducer,
  room: roomSlice.reducer,
  messages: messageSlice.reducer,
};

const reducer = combineReducers(reducerObject);

export const store = configureStore({
  reducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
