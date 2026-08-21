import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tourReducer from "./slices/tourSlice";
import blogReducer from "./slices/blogSlice";
import blogCategoryReducer from "./slices/blogCategorySlice";
import galleryReducer from "./slices/gallerySlice";
import moodReducer from "./slices/moodSlice";
import regionReducer from "./slices/regionSlice";
import stateReducer from "./slices/stateSlice";
import cityReducer from "./slices/citySlice";
import durationReducer from "./slices/durationSlice";
import testimonialReducer from "./slices/testimonialSlice";
import heroReducer from "./slices/heroSlice";
import dashboardReducer from "./slices/dashboardSlice";
import getMeReducer from "./slices/getmeSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tour: tourReducer,
    blog: blogReducer,
    blogCategory: blogCategoryReducer,
    gallery: galleryReducer,
    mood: moodReducer,
    region: regionReducer,
    state: stateReducer,
    city: cityReducer,
    duration: durationReducer,
    testimonial: testimonialReducer,
    hero: heroReducer,
    dashboard: dashboardReducer,
    getMe: getMeReducer,
  },
});
