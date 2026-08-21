import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

// Extract useful error message from backend
const extractErrorMessage = (error) => {
  const data = error.response?.data;

  // Example:
  // { success: false, message: "Invalid email or password" }
  if (data?.message) {
    return data.message;
  }
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return (
      data.errors[0]?.msg ||
      data.errors[0]?.message ||
      "Invalid email or password."
    );
  }

  if (data?.error) {
    return data.error;
  }

  return error.message || "Something went wrong. Please try again.";
};

/* =========================
   LOGIN
========================= */

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      if (!response.data?.success || !response.data?.token) {
        return rejectWithValue("Invalid email or password.");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

/* =========================
   REGISTER
========================= */

export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);

      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

/* =========================
   INITIAL STATE
========================= */

const initialState = {
  user: null,

  token: localStorage.getItem("token") || null,

  loading: false,

  error: null,
};

/* =========================
   SLICE
========================= */

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;

      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      /* =================================
         LOGIN
      ================================= */

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.token = action.payload?.token || null;

        // We fetch the user separately using fetchMe()
        state.user = null;

        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Invalid email or password.";
      })

      /* =================================
         REGISTER
      ================================= */

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.token = action.payload?.token || null;

        state.user = null;

        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || action.error?.message || "Registration failed.";
      })
  },
});

export const { clearError, logout } = authSlice.actions;

export default authSlice.reducer;
