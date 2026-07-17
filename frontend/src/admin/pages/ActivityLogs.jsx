import { FaHistory } from "react-icons/fa";

const ActivityLogs = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Activity Logs</h1>
        <p className="text-sm text-slate-500">Track admin activities</p>
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
        <FaHistory className="mx-auto mb-3 text-slate-300" size={32} />
        <p className="text-sm text-slate-500">No activity logs yet.</p>
      </div>
    </div>
  );
};

export default ActivityLogs;
