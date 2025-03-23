import { combineReducers } from "redux";
import authReducer from "./authReducer";
import restaurantReducer from "./restaurantReducer";
import cartReducer from "./cartReducer";
import orderReducer from "./orderReducer";
import adminReducer from "./adminReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  restaurants: restaurantReducer,
  cart: cartReducer,
  orders: orderReducer,
  admin: adminReducer,
});

export default rootReducer;
