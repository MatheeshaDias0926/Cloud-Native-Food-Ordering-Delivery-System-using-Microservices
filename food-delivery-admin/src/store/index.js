import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import restaurantsReducer from "./slices/restaurantsSlice";
import ordersReducer from "./slices/ordersSlice";
import deliveriesReducer from "./slices/deliveriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    restaurants: restaurantsReducer,
    orders: ordersReducer,
    deliveries: deliveriesReducer,
  },
});
