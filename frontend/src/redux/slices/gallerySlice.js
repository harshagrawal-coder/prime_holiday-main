import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as galleryService from "../../services/galleryService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async (params, { rejectWithValue }) => {
    try {
      const response = await galleryService.getGallery(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminGallery = createAsyncThunk(
  "gallery/fetchAdminGallery",
  async (params, { rejectWithValue }) => {
    try {
      const response = await galleryService.getAdminGallery(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createGalleryItem = createAsyncThunk(
  "gallery/createGalleryItem",
  async (data, { rejectWithValue }) => {
    try {
      const response = await galleryService.createGallery(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateGalleryItem = createAsyncThunk(
  "gallery/updateGalleryItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await galleryService.updateGallery(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteGalleryItem = createAsyncThunk(
  "gallery/deleteGalleryItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await galleryService.deleteGallery(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    items: [],
    adminItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearGalleryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = action.payload.data || [];
      })
      .addCase(fetchAdminGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGalleryItem.fulfilled, (state, action) => {
        const created = Array.isArray(action.payload.data)
          ? action.payload.data
          : [action.payload.data];
        state.adminItems.unshift(...created);
      })
      .addCase(createGalleryItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateGalleryItem.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item,
        );
      })
      .addCase(updateGalleryItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearGalleryError } = gallerySlice.actions;
export default gallerySlice.reducer;