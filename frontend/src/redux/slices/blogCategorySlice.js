import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as blogCategoryService from "../../services/blogCategoryService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchBlogCategories = createAsyncThunk(
  "blogCategory/fetchBlogCategories",
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogCategoryService.getBlogCategories(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminBlogCategories = createAsyncThunk(
  "blogCategory/fetchAdminBlogCategories",
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogCategoryService.getAdminBlogCategories(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createBlogCategory = createAsyncThunk(
  "blogCategory/createBlogCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await blogCategoryService.createBlogCategory(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateBlogCategory = createAsyncThunk(
  "blogCategory/updateBlogCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await blogCategoryService.updateBlogCategory(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteBlogCategory = createAsyncThunk(
  "blogCategory/deleteBlogCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await blogCategoryService.deleteBlogCategory(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState: {
    items: [],
    adminItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBlogCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = action.payload.data || [];
      })
      .addCase(fetchAdminBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.adminItems.unshift(action.payload.data);
      })
      .addCase(createBlogCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateBlogCategory.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.map((item) =>
          item._id === action.payload.data._id ? action.payload.data : item,
        );
      })
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBlogCategoryError } = blogCategorySlice.actions;
export default blogCategorySlice.reducer;