// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // your auth slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
