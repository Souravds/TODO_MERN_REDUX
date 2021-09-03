import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';

//store created by configureStore
export const store = configureStore({
  reducer: {
    user: authReducer
  },
});
