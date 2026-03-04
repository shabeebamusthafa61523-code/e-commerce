import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/admin/stats",
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;