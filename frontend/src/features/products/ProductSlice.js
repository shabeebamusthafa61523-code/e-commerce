import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

/* ================= FETCH ================= */
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const { data } = await axios.get(API_URL);
    return data;
  }
);

/* ================= DELETE ================= */
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { userInfo } = getState().auth; // 🔥 FIXED PATH

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

/* ================= UPDATE ================= */
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const { userInfo } = getState().auth; // 🔥 FIXED PATH

      const { data } = await axios.put(
        `${API_URL}/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      return data; // return updated product
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      /* DELETE */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      })

      /* UPDATE */
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export default productSlice.reducer;