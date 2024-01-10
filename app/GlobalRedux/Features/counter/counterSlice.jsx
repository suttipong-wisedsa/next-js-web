"use client"; //this is a client side component

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  value: 0,
  modal: false,
  edit: {},
  id: "",
  get_data: null,
  list: [],
  loading: false,
};
export const fetchUserData = createAsyncThunk(
  "counter/fetchUserData",
  async ({ current, pageSize, search, startDate, endDate }) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/posts?page=${current}&limit=${pageSize}&term=${search}&start_date=${startDate}&end_date=${endDate}}`
      );
      return data;
    } catch (error) {
      throw new Error("Error");
    }
  }
);
export const fetchFakeApi = createAsyncThunk(
  "counter/fetchFakeApi",
  async () => {
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/todos/"
      );
      return data;
    } catch (error) {
      throw new Error("Error");
    }
  }
);
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, data) => {
      state.edit = data.payload;
      state.modal = true;
    },
    setUserList: (state, action) => {
      state.list = action.payload;
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
  extraReducers(builder) {
    builder
      .addCase(fetchUserData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.list = action.payload.posts;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchFakeApi.fulfilled, (state, action) => {
        console.log(action.payload);
      });
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
