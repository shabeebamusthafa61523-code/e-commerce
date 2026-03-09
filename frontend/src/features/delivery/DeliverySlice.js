import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/delivery`;
const ORDERS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

/* ================= AUTH CONFIG ================= */

const getAuthConfig = (getState) => {
const { auth } = getState();

return {
headers: {
Authorization: `Bearer ${auth.userInfo?.token}`,
'Content-Type': 'application/json',
},
};
};

/* ================= ACTIONS ================= */

/* ADMIN: Fetch all partners */
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

/* ADMIN: Register a new partner */
export const registerPartner = createAsyncThunk(
'delivery/registerPartner',
async (partnerData, { getState, rejectWithValue }) => {
try {
const { data } = await axios.post(
`${BASE_URL}/register`,
partnerData,
getAuthConfig(getState)
);
return data;
} catch (error) {
return rejectWithValue(error.response?.data?.message || error.message);
}
}
);

/* ADMIN/RIDER: Toggle specific partner status */
export const toggleAvailability = createAsyncThunk(
'delivery/toggleAvailability',
async ({ id, isAvailable }, { getState, rejectWithValue }) => {
try {
const { data } = await axios.put(
`${BASE_URL}/${id}/toggle`,
{ isAvailable },
getAuthConfig(getState)
);
return data;
} catch (error) {
return rejectWithValue(error.response?.data?.message || error.message);
}
}
);

/* RIDER: Update own availability */
export const updateAvailability = createAsyncThunk(
  'delivery/updateAvailability',
  async ({ isAvailable }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      const { data } = await axios.put(
        `${BASE_URL}/availability`,
        { isAvailable },
        getAuthConfig(getState)
      );

      // --- PERSISTENCE FIX ---
      // Update localStorage so the status survives a refresh
      const updatedUser = { ...userInfo, isAvailable: data.isAvailable };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      return data; // returns { isAvailable: true/false }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
/* RIDER: Fetch marketplace orders */
export const fetchMarketplaceOrders = createAsyncThunk(
'delivery/fetchMarketplaceOrders',
async (_, { getState, rejectWithValue }) => {
try {
const { data } = await axios.get(
`${BASE_URL}/marketplace`,
getAuthConfig(getState)
);
return data;
} catch (error) {
return rejectWithValue(error.response?.data?.message || error.message);
}
}
);

/* RIDER: Fetch my assigned orders */
export const fetchMyOrders = createAsyncThunk(
'delivery/fetchMyOrders',
async (_, { getState, rejectWithValue }) => {
try {
const { data } = await axios.get(
`${BASE_URL}/my-orders`,
getAuthConfig(getState)
);
return data;
} catch (error) {
return rejectWithValue(error.response?.data?.message || error.message);
}
}
);

/* RIDER: Claim order from marketplace */
export const assignOrder = createAsyncThunk(
'delivery/assignOrder',
async ({ orderId, partnerId }, { getState, rejectWithValue }) => {
try {
const { data } = await axios.put(
`${ORDERS_URL}/${orderId}/assign`,
{ partnerId },
getAuthConfig(getState)
);
return data;
} catch (error) {
return rejectWithValue(error.response?.data?.message || error.message);
}
}
);

/* RIDER: Update delivery progress */
export const updateOrderStatus = createAsyncThunk(
'delivery/updateStatus',
async ({ orderId, status }, { getState, rejectWithValue }) => {
try {
const { data } = await axios.put(
`${ORDERS_URL}/${orderId}/status`,
{ status },
getAuthConfig(getState)
);
return data;
} catch (error) {
return rejectWithValue(error.response?.data?.message || error.message);
}
}
);


export const updateProfile = createAsyncThunk(
  'delivery/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      // 1. Get current state to preserve the token
      const { auth: { userInfo } } = getState();
      
      const { data } = await axios.put(
        `${BASE_URL}/profile`, 
        profileData,
        getAuthConfig(getState)
      );

      // 2. CRITICAL: Update localStorage with the NEW data from backend
      // 'data' here is the object your controller just sent back
      localStorage.setItem("userInfo", JSON.stringify(data));

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
marketplaceOrders: [],
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


  /* ADMIN PARTNERS */

  .addCase(fetchPartners.fulfilled, (state, action) => {
    state.loading = false;
    state.partners = action.payload;
  })

  .addCase(registerPartner.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
    state.partners.push(action.payload);
  })

  .addCase(toggleAvailability.fulfilled, (state, action) => {
    state.loading = false;
    const index = state.partners.findIndex(
      (p) => p._id === action.payload._id
    );

    if (index !== -1) {
      state.partners[index].isAvailable = action.payload.isAvailable;
    }
  })

  /* RIDER AVAILABILITY */

  // Inside extraReducers in AuthSlice.js
.addCase("delivery/updateAvailability/fulfilled", (state, action) => {
  if (state.userInfo) {
    // Update the live userInfo state with the new availability
    state.userInfo.isAvailable = action.payload.isAvailable;
  }
})

  /* MARKETPLACE ORDERS */

  .addCase(fetchMarketplaceOrders.fulfilled, (state, action) => {
    state.loading = false;
    state.marketplaceOrders = action.payload;
  })

  /* MY ORDERS */

  .addCase(fetchMyOrders.fulfilled, (state, action) => {
    state.loading = false;
    state.myOrders = action.payload;
  })

  /* CLAIM ORDER */

  .addCase(assignOrder.fulfilled, (state, action) => {
    state.loading = false;

    const order = action.payload;

    state.marketplaceOrders = state.marketplaceOrders.filter(
      (o) => o._id !== order._id
    );

    state.myOrders.push(order);
  })

  /* UPDATE ORDER STATUS */

  .addCase(updateOrderStatus.fulfilled, (state, action) => {
    state.loading = false;

    const index = state.myOrders.findIndex(
      (o) => o._id === action.payload._id
    );

    if (index !== -1) {
      state.myOrders[index].orderStatus = action.payload.orderStatus;
    }
  })



  // Inside extraReducers, add:
.addCase(updateProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.success = true;
  // Update local user info if your API returns the updated user object
  // Note: You might need to update the 'auth' slice too if that's where userInfo lives
})
  /* GLOBAL MATCHERS */

  .addMatcher(
    (action) => action.type.endsWith('/pending'),
    (state) => {
      state.loading = true;
      state.error = null;
    }
  )

  .addMatcher(
    (action) => action.type.endsWith('/rejected'),
    (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  );


},
});

/* ================= EXPORTS ================= */

export const { resetDeliveryStatus } = deliverySlice.actions;

export default deliverySlice.reducer;
