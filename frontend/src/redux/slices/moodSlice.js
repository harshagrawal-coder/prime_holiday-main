import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as moodService from "../../services/moodService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchMoods = createAsyncThunk(
  "mood/fetchMoods",
  async (params, { rejectWithValue }) => {
    try {
      const response = await moodService.getMoods(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createMood = createAsyncThunk(
  "mood/createMood",
  async (data, { rejectWithValue }) => {
    try {
      const response = await moodService.createMood(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateMood = createAsyncThunk(
  "mood/updateMood",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await moodService.updateMood(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateMoodStatus = createAsyncThunk(
  "mood/updateMoodStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await moodService.updateMoodStatus(id, isActive);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteMood = createAsyncThunk(
  "mood/deleteMood",
  async (id, { rejectWithValue }) => {
    try {
      const response = await moodService.deleteMood(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const moodSlice = createSlice({
  name: "mood",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMoodError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoods.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.mood || [];
      })
      .addCase(fetchMoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMood.fulfilled, (state, action) => {
        state.items.unshift(action.payload.mood);
      })
      .addCase(createMood.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateMood.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.mood._id ? action.payload.mood : item,
        );
      })
      .addCase(updateMood.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateMoodStatus.fulfilled, (state, action) => {
        const updated = action.payload.mood;
        state.items = state.items.map((item) =>
          item._id === updated._id ? { ...item, isActive: updated.isActive } : item,
        );
      })
      .addCase(updateMoodStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteMood.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteMood.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMoodError } = moodSlice.actions;
export default moodSlice.reducer;