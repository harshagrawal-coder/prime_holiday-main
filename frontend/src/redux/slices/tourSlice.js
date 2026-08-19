import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as tourService from "../../services/tourService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchTours = createAsyncThunk(
  "tour/fetchTours",
  async (params, { rejectWithValue }) => {
    try {
      const response = await tourService.getTours(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchTourBySlug = createAsyncThunk(
  "tour/fetchTourBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await tourService.getTourBySlug(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchSimilarTours = createAsyncThunk(
  "tour/fetchSimilarTours",
  async (id, { rejectWithValue }) => {
    try {
      const response = await tourService.getSimilarTours(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminTours = createAsyncThunk(
  "tour/fetchAdminTours",
  async (params, { rejectWithValue }) => {
    try {
      const response = await tourService.getAdminTours(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createTour = createAsyncThunk(
  "tour/createTour",
  async (data, { rejectWithValue }) => {
    try {
      const response = await tourService.createTour(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateTour = createAsyncThunk(
  "tour/updateTour",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await tourService.updateTour(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteTour = createAsyncThunk(
  "tour/deleteTour",
  async (id, { rejectWithValue }) => {
    try {
      const response = await tourService.deleteTour(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const tourSlice = createSlice({
  name: "tour",
  initialState: {
    items: [],
    item: null,
    similarItems: [],
    adminItems: [],
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTourError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTourBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload.data || null;
      })
      .addCase(fetchTourBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSimilarTours.fulfilled, (state, action) => {
        state.similarItems = action.payload.data || [];
      })
      .addCase(fetchSimilarTours.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAdminTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTours.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAdminTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTour.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTour.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTour.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteTour.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTourError } = tourSlice.actions;
export default tourSlice.reducer;