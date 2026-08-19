import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as stateService from "../../services/stateService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchStates = createAsyncThunk(
  "state/fetchStates",
  async (params, { rejectWithValue }) => {
    try {
      const response = await stateService.getStates(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createState = createAsyncThunk(
  "state/createState",
  async (data, { rejectWithValue }) => {
    try {
      const response = await stateService.createState(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateState = createAsyncThunk(
  "state/updateState",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await stateService.updateState(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateStateStatus = createAsyncThunk(
  "state/updateStateStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await stateService.updateStateStatus(id, isActive);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteState = createAsyncThunk(
  "state/deleteState",
  async (id, { rejectWithValue }) => {
    try {
      const response = await stateService.deleteState(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const stateSlice = createSlice({
  name: "state",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.states || [];
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.items.unshift(action.payload.populateState);
      })
      .addCase(createState.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateState.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.populateState._id ? action.payload.populateState : item,
        );
      })
      .addCase(updateState.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateStateStatus.fulfilled, (state, action) => {
        const updated = action.payload.populateState;
        state.items = state.items.map((item) =>
          item._id === updated._id ? { ...item, isActive: updated.isActive } : item,
        );
      })
      .addCase(updateStateStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearStateError } = stateSlice.actions;
export default stateSlice.reducer;