import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import PageLoader from "./components/ui/PageLoader";
import AdminLayout from "./admin/layout/AdminLayout";

// ===============================
// PUBLIC PAGES
// ===============================

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage"));
const BlogCategoryPage = lazy(() => import("./pages/BlogCategoryPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TourPage = lazy(() => import("./pages/TourPage"));
const TourDetailsPage = lazy(() => import("./pages/TourDetailsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));

// ===============================
// USER AUTH
// ===============================

const UserLoginPage = lazy(() => import("./user/pages/Login"));
const UserRegisterPage = lazy(() => import("./user/pages/Register"));

// ===============================
// USER DASHBOARD
// ===============================

const DashboardHome = lazy(() => import("./user/pages/DashboardHome"));
const Bookings = lazy(() => import("./user/pages/Bookings"));
const SavedTrips = lazy(() => import("./user/pages/SavedTrips"));
const Profile = lazy(() => import("./user/pages/Profile"));

// ===============================
// ADMIN PAGES
// ===============================

const AdminLoginPage = lazy(() => import("./admin/pages/Login"));
const AdminDashboardPage = lazy(() => import("./admin/pages/Dashboard"));
const AdminBookingsPage = lazy(() => import("./admin/pages/Bookings"));
const AdminToursPage = lazy(() => import("./admin/pages/Tours"));
const AdminAddTourPage = lazy(() => import("./admin/pages/AddTour"));

const AdminBlogPage = lazy(() => import("./admin/pages/Blog"));
const AdminAddBlogPage = lazy(() => import("./admin/pages/AddBlog"));

const AdminUsersPage = lazy(() => import("./admin/pages/Users"));
const AdminMessagesPage = lazy(() => import("./admin/pages/Messages"));
const AdminGalleryPage = lazy(() => import("./admin/pages/Gallery"));
const AdminSettingsPage = lazy(() => import("./admin/pages/Settings"));
const AdminTestimonialsPage = lazy(() => import("./admin/pages/Testimonials"));
const AdminCategoriesPage = lazy(() => import("./admin/pages/Categories"));
const AdminCouponsPage = lazy(() => import("./admin/pages/Coupons"));
// const AdminReviewsPage = lazy(() => import("./admin/pages/Reviews"));
const AdminActivityPage = lazy(() => import("./admin/pages/ActivityLogs"));
const AdminAnalyticsPage = lazy(() => import("./admin/pages/Analytics"));
const AdminContactsPage = lazy(
  () => import("./admin/pages/Contacts"),
);
const AdminHeroHomePage = lazy(() => import("./admin/pages/HeroHomePage"));

// ===============================
// MASTER DATA
// ===============================

const AdminMasterDataPage = lazy(() => import("./admin/pages/MasterData"));

const AdminRegionsPage = lazy(() => import("./admin/pages/Regions"));

const AdminStatesPage = lazy(() => import("./admin/pages/States"));

const AdminCitiesPage = lazy(() => import("./admin/pages/Cities"));

const AdminMoodsPage = lazy(() => import("./admin/pages/Moods"));

const AdminDurationsPage = lazy(() => import("./admin/pages/Durations"));

// =====================================================
// PUBLIC APP
// =====================================================

const PublicApp = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route
          path="/blog/category/:categorySlug"
          element={<BlogCategoryPage />}
        />
        <Route path="/blog/:slug" element={<BlogDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/tour" element={<TourPage />} />
        <Route path="/tours" element={<TourPage />} />
        <Route path="/tour/:slug" element={<TourDetailsPage />} />
        <Route path="/tours/:id" element={<TourDetailsPage />} />
        <Route path="/reserve" element={<BookingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </MainLayout>
  );
};

// =====================================================
// USER APP
// NO PROTECTED ROUTE
// =====================================================

const UserApp = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="saved" element={<SavedTrips />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const AdminApp = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="" element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<AdminDashboardPage />} />
        {/* Bookings */}
        <Route path="bookings" element={<AdminBookingsPage />} />
        {/* Tours */}
        <Route path="tours" element={<AdminToursPage />} />
        <Route path="tours/new" element={<AdminAddTourPage />} />
        {/* Blog */}
        <Route path="blog" element={<AdminBlogPage />} />
        <Route path="blog/new" element={<AdminAddBlogPage />} />
        <Route path="blog/edit/:id" element={<AdminAddBlogPage />} />
        {/* Other Admin Pages */}
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        {/* <Route path="reviews" element={<AdminReviewsPage />} /> */}
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="contacts" element={<AdminContactsPage />} />
        <Route path="activity" element={<AdminActivityPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="hero-slider" element={<AdminHeroHomePage />} />
        {/* =========================
            MASTER DATA
        ========================= */}

        <Route path="masterdata" element={<AdminMasterDataPage />} />
        <Route path="masterdata/regions" element={<AdminRegionsPage />} />
        <Route path="masterdata/states" element={<AdminStatesPage />} />
        <Route path="masterdata/cities" element={<AdminCitiesPage />} />
        <Route path="masterdata/moods" element={<AdminMoodsPage />} />
        <Route path="masterdata/durations" element={<AdminDurationsPage />} />
      </Route>
      {/* Invalid admin URL */}

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

// =====================================================
// MAIN APP
// =====================================================

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* =========================
            ADMIN
        ========================= */}

        <Route path="/admin/*" element={<AdminApp />} />

        {/* =========================
            USER DASHBOARD
        ========================= */}

        <Route path="/dashboard/*" element={<UserApp />} />

        {/* =========================
            USER LOGIN
        ========================= */}

        <Route path="/login" element={<UserLoginPage />} />

        {/* =========================
            USER REGISTER
        ========================= */}

        <Route path="/register" element={<UserRegisterPage />} />

        {/* =========================
            PUBLIC WEBSITE
        ========================= */}

        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </Suspense>
  );
};

export default App;
