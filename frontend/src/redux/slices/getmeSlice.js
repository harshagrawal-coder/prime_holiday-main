import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMe } from "../../services/authService";

// ===============================
// FETCH CURRENT USER
// ===============================
export const fetchMe = createAsyncThunk(
  "getMe/fetchMe",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getMe();

      console.log("FETCH ME RESPONSE:", response.data);

      return response.data;
    } catch (error) {
      console.log("FETCH ME ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Unable to fetch user.",
      );
    }
  },
);

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  user: null,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,
};

// ===============================
// SLICE
// ===============================
const getMeSlice = createSlice({
  name: "getMe",

  initialState,

  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // PENDING
      // =========================
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // =========================
      // SUCCESS
      // =========================
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        console.log("FETCH ME PAYLOAD:", action.payload);

        state.user = action.payload?.user || null;
      })

      // =========================
      // ERROR
      // =========================
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;

        state.user = null;

        state.error =
          action.payload || action.error?.message || "Unable to fetch user.";
      });
  },
});

export const { clearUser } = getMeSlice.actions;

export default getMeSlice.reducer;
