import { FaSearch } from "react-icons/fa";

const SEOPanel = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">SEO Panel</h1>
        <p className="text-sm text-slate-500">Manage SEO settings</p>
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
        <FaSearch className="mx-auto mb-3 text-slate-300" size={32} />
        <p className="text-sm text-slate-500">SEO panel coming soon.</p>
      </div>
    </div>
  );
};

export default SEOPanel;
