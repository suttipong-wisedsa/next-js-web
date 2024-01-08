"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  modal: false,
  edit: {},
  id: "",
  get_data: null,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, data) => {
      state.edit = data.payload;
      state.modal = true;
    },
    closeModal: (state) => {
      state.modal = false;
    },
    deleteArray: (state, action) => {
      state.id = action.payload;
    },
    getData(state, action) {
      state.get_data = action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  closeModal,
  deleteArray,
  getData,
} = counterSlice.actions;

export default counterSlice.reducer;
