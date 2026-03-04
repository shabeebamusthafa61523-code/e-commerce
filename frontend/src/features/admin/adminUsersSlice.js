// src/redux/adminUsersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users `, {
        headers: { Authorization: `Bearer ${auth.userInfo.token}` },
      });
      return data; // array of users
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "adminUsers/updateUser",
  async ({ id, name, email }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.patch(
        `/api/admin/users/${id}`,
        { name, email },
        {
          headers: { Authorization: `Bearer ${auth.userInfo.token}` },
        }
      );
      return data; // updated user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.userInfo.token}` },
      });
      return id; // return deleted user id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminUsersSlice.reducer;