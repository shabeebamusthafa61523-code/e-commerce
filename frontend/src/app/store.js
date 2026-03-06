import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/ProductSlice";
import authReducer from "../features/Auth/AuthSlice";
import adminReducer from "../features/admin/adminSlice";
import adminUsersReducer from "../features/admin/adminUsersSlice";
import addressReducer from "../features/address/addressSlice";
import deliveryReducer from "../features/delivery/DeliverySlice";
export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    admin: adminReducer,
    adminUsers: adminUsersReducer,
    address: addressReducer,
    delivery: deliveryReducer,
  },
});
