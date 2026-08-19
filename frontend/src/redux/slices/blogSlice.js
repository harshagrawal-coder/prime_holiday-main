import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as blogService from "../../services/blogService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchBlogBySlug = createAsyncThunk(
  "blog/fetchBlogBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogBySlug(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminBlogs = createAsyncThunk(
  "blog/fetchAdminBlogs",
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogService.getAdminBlogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (data, { rejectWithValue }) => {
    try {
      const response = await blogService.createBlog(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await blogService.updateBlog(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      const response = await blogService.deleteBlog(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    items: [],
    item: null,
    adminItems: [],
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload.data || null;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.item = action.payload.data || null;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createBlog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;