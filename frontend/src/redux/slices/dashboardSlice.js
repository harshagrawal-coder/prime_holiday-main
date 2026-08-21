import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as tourService from "../../services/tourService";
import * as blogService from "../../services/blogService";
import * as galleryService from "../../services/galleryService";
import * as bookingService from "../../services/bookingService";
import * as authService from "../../services/authService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const [tours, blogs, gallery, bookings, userCount] = await Promise.all([
        tourService.getAdminTours({ limit: 1 }),
        blogService.getAdminBlogs({ limit: 1 }),
        galleryService.getAdminGallery({ limit: 1 }),
        bookingService.getAdminBookings({ limit: 1 }),
        authService.getUserCount(),
      ]);
      return {
        tours: tours.data.pagination?.totalTours ?? tours.data.data?.length ?? 0,
        blogs: blogs.data.pagination?.totalBlogs ?? blogs.data.data?.length ?? 0,
        gallery: gallery.data.pagination?.totalImages ?? gallery.data.data?.length ?? 0,
        bookings:
          bookings.data.pagination?.totalBookings ?? bookings.data.data?.length ?? 0,
        users: userCount.data?.count ?? 0,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {
      tours: 0,
      blogs: 0,
      gallery: 0,
      bookings: 0,
      users: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;