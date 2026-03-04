import { createSlice } from "@reduxjs/toolkit";

const stored = localStorage.getItem("addresses");

const initialState = {
  addresses: stored ? JSON.parse(stored) : [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      const newAddress = {
        ...action.payload,
        id: Date.now(),
        isDefault: state.addresses.length === 0,
      };
      state.addresses.push(newAddress);
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },

    setDefaultAddress: (state, action) => {
      state.addresses = state.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === action.payload,
      }));
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload
      );
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },

    updateAddress: (state, action) => {
      state.addresses = state.addresses.map((addr) =>
        addr.id === action.payload.id ? action.payload : addr
      );
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },
  },
});

export const {
  addAddress,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
} = addressSlice.actions;

export default addressSlice.reducer;