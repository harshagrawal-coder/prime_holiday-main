import { useEffect } from "react";
import { FaSuitcaseRolling, FaBlog, FaImages, FaCalendarCheck, FaUsers, FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../redux/slices/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const cards = [
    { label: "Tours", value: stats.tours, icon: FaSuitcaseRolling, color: "bg-blue-500" },
    { label: "Blog Posts", value: stats.blogs, icon: FaBlog, color: "bg-green-500" },
    { label: "Gallery", value: stats.gallery, icon: FaImages, color: "bg-purple-500" },
    { label: "Bookings", value: stats.bookings, icon: FaCalendarCheck, color: "bg-orange-500" },
    { label: "Users", value: stats.users, icon: FaUsers, color: "bg-pink-500" },
    { label: "Messages", value: null, icon: FaEnvelope, color: "bg-teal-500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <button
          onClick={() => dispatch(fetchDashboardStats())}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">
                  {loading && value === null ? (
                    <span className="text-slate-300">...</span>
                  ) : value === null ? (
                    <span className="text-slate-300">—</span>
                  ) : (
                    value
                  )}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} bg-opacity-20`}>
                <Icon className="text-white" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;