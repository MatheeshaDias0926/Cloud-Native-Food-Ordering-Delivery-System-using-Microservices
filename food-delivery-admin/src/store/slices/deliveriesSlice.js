import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDeliveries,
  getDelivery,
  updateDeliveryStatus,
} from "../../services/api";

export const fetchDeliveries = createAsyncThunk(
  "deliveries/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeliveries();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch deliveries"
      );
    }
  }
);

export const fetchDelivery = createAsyncThunk(
  "deliveries/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getDelivery(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch delivery"
      );
    }
  }
);

export const updateDelivery = createAsyncThunk(
  "deliveries/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await updateDeliveryStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update delivery status"
      );
    }
  }
);

const initialState = {
  deliveries: [],
  selectedDelivery: null,
  loading: false,
  error: null,
};

const deliveriesSlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    clearSelectedDelivery: (state) => {
      state.selectedDelivery = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload.data;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDelivery.fulfilled, (state, action) => {
        state.selectedDelivery = action.payload.data;
      })
      .addCase(updateDelivery.fulfilled, (state, action) => {
        const index = state.deliveries.findIndex(
          (delivery) => delivery._id === action.payload.data._id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload.data;
        }
        if (state.selectedDelivery?._id === action.payload.data._id) {
          state.selectedDelivery = action.payload.data;
        }
      });
  },
});

export const { clearSelectedDelivery, clearError } = deliveriesSlice.actions;
export default deliveriesSlice.reducer;
