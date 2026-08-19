import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as durationService from "../../services/durationService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchDurations = createAsyncThunk(
  "duration/fetchDurations",
  async (params, { rejectWithValue }) => {
    try {
      const response = await durationService.getDurations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createDuration = createAsyncThunk(
  "duration/createDuration",
  async (data, { rejectWithValue }) => {
    try {
      const response = await durationService.createDuration(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateDuration = createAsyncThunk(
  "duration/updateDuration",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await durationService.updateDuration(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateDurationStatus = createAsyncThunk(
  "duration/updateDurationStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await durationService.updateDurationStatus(id, isActive);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteDuration = createAsyncThunk(
  "duration/deleteDuration",
  async (id, { rejectWithValue }) => {
    try {
      const response = await durationService.deleteDuration(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const durationSlice = createSlice({
  name: "duration",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDurationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDurations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDurations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.durations || [];
      })
      .addCase(fetchDurations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDuration.fulfilled, (state, action) => {
        state.items.unshift(action.payload.duration);
      })
      .addCase(createDuration.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDuration.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.duration._id ? action.payload.duration : item,
        );
      })
      .addCase(updateDuration.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDurationStatus.fulfilled, (state, action) => {
        const updated = action.payload.duration;
        state.items = state.items.map((item) =>
          item._id === updated._id ? { ...item, isActive: updated.isActive } : item,
        );
      })
      .addCase(updateDurationStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDuration.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteDuration.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearDurationError } = durationSlice.actions;
export default durationSlice.reducer;