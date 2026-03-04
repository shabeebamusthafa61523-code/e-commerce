import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Get user from localStorage
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, userData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, userData);

      console.log("LOGIN SUCCESS DATA:", data);  // 👈 ADD THIS

      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;

    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data); // 👈 ADD THIS
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// LOGOUT
const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
