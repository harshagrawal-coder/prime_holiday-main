import { FaSuitcaseRolling, FaBlog, FaImages, FaCalendarCheck, FaUsers, FaEnvelope } from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    { label: "Tours", value: 0, icon: FaSuitcaseRolling, color: "bg-blue-500" },
    { label: "Blog Posts", value: 0, icon: FaBlog, color: "bg-green-500" },
    { label: "Gallery", value: 0, icon: FaImages, color: "bg-purple-500" },
    { label: "Bookings", value: 0, icon: FaCalendarCheck, color: "bg-orange-500" },
    { label: "Users", value: 0, icon: FaUsers, color: "bg-pink-500" },
    { label: "Messages", value: 0, icon: FaEnvelope, color: "bg-teal-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
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
