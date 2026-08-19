import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as testimonialService from "../../services/testimonialService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchTestimonials = createAsyncThunk(
  "testimonial/fetchTestimonials",
  async (params, { rejectWithValue }) => {
    try {
      const response = await testimonialService.getTestimonials(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminTestimonials = createAsyncThunk(
  "testimonial/fetchAdminTestimonials",
  async (params, { rejectWithValue }) => {
    try {
      const response = await testimonialService.getAdminTestimonials(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createTestimonial = createAsyncThunk(
  "testimonial/createTestimonial",
  async (data, { rejectWithValue }) => {
    try {
      const response = await testimonialService.createTestimonial(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateTestimonial = createAsyncThunk(
  "testimonial/updateTestimonial",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await testimonialService.updateTestimonial(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateTestimonialStatus = createAsyncThunk(
  "testimonial/updateTestimonialStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await testimonialService.updateTestimonialStatus(
        id,
        isActive,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteTestimonial = createAsyncThunk(
  "testimonial/deleteTestimonial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await testimonialService.deleteTestimonial(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState: {
    items: [],
    adminItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTestimonialError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.testimonials || [];
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = action.payload.data || [];
      })
      .addCase(fetchAdminTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.adminItems.unshift(action.payload.testimonial);
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.map((item) =>
          item._id === action.payload.testimonial._id ? action.payload.testimonial : item,
        );
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTestimonialStatus.fulfilled, (state, action) => {
        const updated = action.payload.testimonial;
        state.adminItems = state.adminItems.map((item) =>
          item._id === updated._id ? { ...item, isActive: updated.isActive } : item,
        );
      })
      .addCase(updateTestimonialStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTestimonialError } = testimonialSlice.actions;
export default testimonialSlice.reducer;