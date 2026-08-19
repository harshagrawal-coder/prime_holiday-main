import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as regionService from "../../services/regionService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchRegions = createAsyncThunk(
  "region/fetchRegions",
  async (params, { rejectWithValue }) => {
    try {
      const response = await regionService.getRegions(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createRegion = createAsyncThunk(
  "region/createRegion",
  async (data, { rejectWithValue }) => {
    try {
      const response = await regionService.createRegion(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateRegion = createAsyncThunk(
  "region/updateRegion",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await regionService.updateRegion(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateRegionStatus = createAsyncThunk(
  "region/updateRegionStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await regionService.updateRegionStatus(id, isActive);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteRegion = createAsyncThunk(
  "region/deleteRegion",
  async (id, { rejectWithValue }) => {
    try {
      const response = await regionService.deleteRegion(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const regionSlice = createSlice({
  name: "region",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRegionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.regions || [];
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRegion.fulfilled, (state, action) => {
        state.items.unshift(action.payload.region);
      })
      .addCase(createRegion.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.region._id ? action.payload.region : item,
        );
      })
      .addCase(updateRegion.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateRegionStatus.fulfilled, (state, action) => {
        const updated = action.payload.region;
        state.items = state.items.map((item) =>
          item._id === updated._id ? { ...item, isActive: updated.isActive } : item,
        );
      })
      .addCase(updateRegionStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteRegion.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearRegionError } = regionSlice.actions;
export default regionSlice.reducer;