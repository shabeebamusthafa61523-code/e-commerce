import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/delivery`;
const ORDERS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

const getAuthConfig = (getState) => {
  const { auth: { userInfo } } = getState();
  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      'Content-Type': 'application/json',
    },
  };
};

/* ================= ACTIONS ================= */

// ADMIN: Fetch all partners
export const fetchPartners = createAsyncThunk(
  'delivery/fetchPartners',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/partners`, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ADMIN: Register a new partner
export const registerPartner = createAsyncThunk(
  'delivery/registerPartner',
  async (partnerData, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/register`, partnerData, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ADMIN/RIDER: Toggle specific partner status
export const toggleAvailability = createAsyncThunk(
  'delivery/toggleAvailability',
  async ({ id, isAvailable }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/${id}/toggle`, { isAvailable }, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// RIDER: Update own availability (Matches Dashboard Toggle)
export const updateAvailability = createAsyncThunk(
  'delivery/updateAvailability',
  async ({ isAvailable }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/availability`, { isAvailable }, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// RIDER: Claim order from Marketplace
export const assignOrder = createAsyncThunk(
  'delivery/assignOrder',
  async ({ orderId, partnerId }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${ORDERS_URL}/${orderId}/assign`, { partnerId }, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// RIDER: Update Order Progress (picked up -> delivered)
export const updateOrderStatus = createAsyncThunk(
  'delivery/updateStatus',
  async ({ orderId, status }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${ORDERS_URL}/${orderId}/status`, { status }, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ================= SLICE ================= */

const deliverySlice = createSlice({
  name: 'delivery',
  initialState: {
    partners: [],
    myOrders: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetDeliveryStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(registerPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.partners.push(action.payload);
      })
      // In DeliverySlice.js extraReducers
.addCase(updateAvailability.fulfilled, (state, action) => {
  state.loading = false;
  state.success = true;
  // If your backend returns the updated user object or just { isAvailable }:
  // Note: Since userInfo is in the Auth slice, you might need to handle 
  // the state update there, or update a local copy in this slice.
})
      .addCase(toggleAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.partners.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.partners[index].isAvailable = action.payload.isAvailable;
        }
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myOrders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.myOrders[index].orderStatus = action.payload.orderStatus;
        }
      })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



// 1. Export the standard actions from the slice
export const { resetDeliveryStatus } = deliverySlice.actions;

// 2. Export the reducer as the default
export default deliverySlice.reducer;