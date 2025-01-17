import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface State {
  finishedList: Array<string>;
  locale: string;
}

const initState: State = {
  finishedList: [],
  locale: "en",
};

const commonSlice = createSlice({
  name: "common",
  initialState: initState,
  reducers: {
    markLevelAsFinished(state, { payload }: PayloadAction<string | string[]>) {
      let shouldUpdate = false;
      const payloadList = Array.isArray(payload) ? payload : [payload];
      const newFinishedList = state.finishedList.slice();
      payloadList.forEach((item) => {
        if (newFinishedList.indexOf(item) >= 0) {
          return;
        }

        newFinishedList.push(item);
        shouldUpdate = true;
      });

      if (shouldUpdate) {
        state.finishedList = newFinishedList;
        localStorage.setItem("twvc-finished", state.finishedList.join(","));
      }
    },
    setLocale(state, { payload }: PayloadAction<string>) {
      state.locale = payload;
    },
  },
});

export const { markLevelAsFinished, setLocale } = commonSlice.actions;

export default commonSlice.reducer;
