import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cityService from "../../services/cityService";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message;

export const fetchCities = createAsyncThunk(
  "city/fetchCities",
  async (params, { rejectWithValue }) => {
    try {
      const response = await cityService.getCities(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createCity = createAsyncThunk(
  "city/createCity",
  async (data, { rejectWithValue }) => {
    try {
      const response = await cityService.createCity(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCity = createAsyncThunk(
  "city/updateCity",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cityService.updateCity(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCityStatus = createAsyncThunk(
  "city/updateCityStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await cityService.updateCityStatus(id, isActive);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteCity = createAsyncThunk(
  "city/deleteCity",
  async (id, { rejectWithValue }) => {
    try {
      const response = await cityService.deleteCity(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const citySlice = createSlice({
  name: "city",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cities || [];
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.items.unshift(action.payload.populatedCity);
      })
      .addCase(createCity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload.populatedCity._id ? action.payload.populatedCity : item,
        );
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCityStatus.fulfilled, (state, action) => {
        const updated = action.payload.populatedCity;
        state.items = state.items.map((item) =>
          item._id === updated._id ? { ...item, isActive: updated.isActive } : item,
        );
      })
      .addCase(updateCityStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.meta.arg,
        );
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCityError } = citySlice.actions;
export default citySlice.reducer;