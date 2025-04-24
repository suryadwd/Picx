import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice.js"
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth:authSlice,
  post:postSlice,
  socketio:socketSlice,
  chat:chatSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;


//ye pura sahi h bas e maine jaise h waise chos diya tha kuch post banai logout  login kiya jis acount se login kiya usse kuch post dale fir logout liya dusre account banae usmebhi same cheeze kiya aur chal gaya a