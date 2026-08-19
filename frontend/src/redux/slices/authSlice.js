import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

const USER_STORAGE_KEY = "prime-holiday-user-auth";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getStoredUser(),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.userData;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(action.payload.userData),
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.userData;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(action.payload.userData),
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem(USER_STORAGE_KEY);
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem(USER_STORAGE_KEY);
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
