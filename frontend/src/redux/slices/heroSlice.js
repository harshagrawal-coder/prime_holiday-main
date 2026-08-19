import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as heroService from "../../services/heroService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchHeroImages = createAsyncThunk(
  "hero/fetchHeroImages",
  async (params, { rejectWithValue }) => {
    try {
      const response = await heroService.getHeroImages(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminHeroImages = createAsyncThunk(
  "hero/fetchAdminHeroImages",
  async (params, { rejectWithValue }) => {
    try {
      const response = await heroService.getAdminHeroImages(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createHeroImage = createAsyncThunk(
  "hero/createHeroImage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await heroService.createHeroImage(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateHeroImage = createAsyncThunk(
  "hero/updateHeroImage",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await heroService.updateHeroImage(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteHeroImage = createAsyncThunk(
  "hero/deleteHeroImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await heroService.deleteHeroImage(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const heroSlice = createSlice({
  name: "hero",
  initialState: {
    items: [],
    adminItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearHeroError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroImages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(fetchHeroImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminHeroImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminHeroImages.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = action.payload.data || [];
      })
      .addCase(fetchAdminHeroImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHeroImage.fulfilled, (state, action) => {
        state.adminItems.unshift(action.payload.data);
      })
      .addCase(createHeroImage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateHeroImage.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item,
        );
      })
      .addCase(updateHeroImage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteHeroImage.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteHeroImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearHeroError } = heroSlice.actions;
export default heroSlice.reducer;