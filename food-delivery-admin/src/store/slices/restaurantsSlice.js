import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../../services/api";

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRestaurants();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch restaurants"
      );
    }
  }
);

export const fetchRestaurant = createAsyncThunk(
  "restaurants/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRestaurant(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch restaurant"
      );
    }
  }
);

export const updateRestaurantDetails = createAsyncThunk(
  "restaurants/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateRestaurant(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update restaurant"
      );
    }
  }
);

export const removeRestaurant = createAsyncThunk(
  "restaurants/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteRestaurant(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete restaurant"
      );
    }
  }
);

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
};

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.data;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRestaurant.fulfilled, (state, action) => {
        state.selectedRestaurant = action.payload.data;
      })
      .addCase(updateRestaurantDetails.fulfilled, (state, action) => {
        const index = state.restaurants.findIndex(
          (restaurant) => restaurant._id === action.payload.data._id
        );
        if (index !== -1) {
          state.restaurants[index] = action.payload.data;
        }
        if (state.selectedRestaurant?._id === action.payload.data._id) {
          state.selectedRestaurant = action.payload.data;
        }
      })
      .addCase(removeRestaurant.fulfilled, (state, action) => {
        state.restaurants = state.restaurants.filter(
          (restaurant) => restaurant._id !== action.payload
        );
        if (state.selectedRestaurant?._id === action.payload) {
          state.selectedRestaurant = null;
        }
      });
  },
});

export const { clearSelectedRestaurant, clearError } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
