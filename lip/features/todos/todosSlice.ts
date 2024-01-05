import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

export const counterSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    increment: (state) => {
      console.log("ddd");
      //   state.open = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment } = counterSlice.actions;

export default counterSlice.reducer;
