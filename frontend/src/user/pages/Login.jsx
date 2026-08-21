import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUser } from "../../redux/slices/authSlice";
import { fetchMe } from "../../redux/slices/getmeSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts typing
    if (formError) {
      setFormError("");
    }

    dispatch(clearError());
  };

  /* =========================================
     LOGIN
  ========================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    dispatch(clearError());
    const email = formData.email.trim();
    const password = formData.password.trim();
    /* -----------------------------------------
       FRONTEND VALIDATION
    ----------------------------------------- */
    if (!email) {
      setFormError("Email is required.");
      return;
    }
    if (!password) {
      setFormError("Password is required.");
      return;
    }
    try {
      /* ---------------------------------------
         LOGIN REQUEST
      --------------------------------------- */

      const loginResponse = await dispatch(
        loginUser({
          email,
          password,
        }),
      ).unwrap();

      console.log("LOGIN SUCCESS:", loginResponse);

      /* ---------------------------------------
         GET CURRENT USER
      --------------------------------------- */

      const meResponse = await dispatch(fetchMe()).unwrap();

      console.log("CURRENT USER:", meResponse);

      const role = meResponse?.user?.role;

      /* ---------------------------------------
         REDIRECT
      --------------------------------------- */

      if (role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      console.log("LOGIN ERROR RECEIVED BY UI:", error);
      //setFormError(error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-500">
            Welcome Back
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
            Sign in to your account
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Access your trips, bookings, and saved destinations.
          </p>
        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* =====================================
              ERROR
          ===================================== */}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            >
              {error}
            </div>
          )}

          {/* =====================================
              SUBMIT BUTTON
          ===================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* REGISTER */}

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Create one
          </Link>
        </p>

        {/* ADMIN LOGIN */}

        <div className="mt-4 text-center">
          <Link
            to="/admin/login"
            className="text-xs text-slate-400 underline-offset-2 hover:text-orange-500 hover:underline"
          >
            Admin login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
