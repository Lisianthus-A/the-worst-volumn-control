import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./common";

const store = configureStore({
  reducer: {
    common: commonReducer,
  },
});

if (import.meta.env.DEV) {
  // @ts-ignore
  window._store = store;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
