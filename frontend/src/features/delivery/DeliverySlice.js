import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Matches your Auth and Product slice pattern
// deliverySlice.js
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/delivery`;


/**
 * Helper to extract token from Redux State.
 * Note: Uses 'auth' to match your working AuthSlice.
 */
const getAuthConfig = (getState) => {
  const { auth: { userInfo } } = getState();
  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      'Content-Type': 'application/json',
    },
  };
};

/* ================= ADMIN ACTIONS ================= */

// Matches: GET /api/delivery/partners/available
export const fetchPartners = createAsyncThunk(
  'delivery/fetchPartners',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/partners/available`, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Matches: POST /api/delivery/register
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

// Matches: PUT /api/delivery/:id/toggle
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

// Matches: PUT /api/orders/:id/assign (Note: Adjusted to your order API path)
export const assignOrder = createAsyncThunk(
  'delivery/assignOrder',
  async ({ orderId, partnerId }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };
      // Note: We use the order API route here as it modifies the Order model
      const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/assign`, { partnerId }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ================= RIDER ACTIONS ================= */

// Matches: GET /api/delivery/my-orders
export const fetchMyDeliveries = createAsyncThunk(
  'delivery/fetchMyDeliveries',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/my-orders`, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Matches: PUT /api/delivery/order/:id
export const updateOrderStatus = createAsyncThunk(
  'delivery/updateStatus',
  async ({ orderId, status }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/order/${orderId}`, { status }, getAuthConfig(getState));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
      // Fetch Partners
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      // Register Partner
      .addCase(registerPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.partners.push(action.payload);
      })
      // Toggle Availability
      .addCase(toggleAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.partners.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.partners[index].isAvailable = action.payload.isAvailable;
        }
      })
      // Fetch Rider Orders
      .addCase(fetchMyDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myOrders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.myOrders[index].orderStatus = action.payload.orderStatus;
        }
      })
      // Global Pending/Rejected Matchers
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDeliveryStatus } = deliverySlice.actions;
export default deliverySlice.reducer;