import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaGlobeAsia,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import {
  fetchRegions,
  createRegion,
  updateRegion,
  deleteRegion,
  updateRegionStatus,
} from "../../redux/slices/regionSlice";
const Regions = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.region);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    seterror("");
    if (!formData.name.trim()) {
      console.log("Region name is required");
      return;
    }
    try {
      const result = editingId
        ? await dispatch(updateRegion({ id: editingId, data: { name: formData.name } }))
        : await dispatch(createRegion({ name: formData.name }));
      if (result.error) {
        throw new Error(result.payload || "Failed to save region");
      }
      closeModal();
    } catch (error) {
      seterror(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);
  const handleDelete = async (regionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this region?",
    );

    if (!confirmDelete) {
      return;
    }
    dispatch(deleteRegion(regionId));
  };

  const toggleStatus = async (id, current) => {
    try {
      const result = await dispatch(updateRegionStatus({ id, isActive: !current }));
      if (result.error) {
        throw new Error(result.payload || "failed to update region status");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({ name: item.name });
    } else {
      setEditingId(null);
      setFormData({ name: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "" });
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Regions</h1>
          <p className="text-sm text-slate-500">
            Manage geographic tour regions
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 self-start rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:self-auto"
        >
          <FaPlus size={14} />
          Add Region
        </button>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "all"
              ? "bg-orange-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => {
            setActiveFilter("all");
            dispatch(fetchRegions());
          }}
        >
          All
        </button>

        <button
          onClick={() => {
            setActiveFilter("active");
            dispatch(fetchRegions({ isActive: true }));
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "active"
              ? "bg-orange-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => {
            setActiveFilter("inactive");
            dispatch(fetchRegions({ isActive: false }));
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "inactive"
              ? "bg-orange-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Inactive
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No regions yet. Add one to get started.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {items.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FaGlobeAsia size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 truncate">{item.slug}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button onClick={() => openModal(item)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-500 transition">
                    <FaEdit size={12} /> Edit
                  </button>
                  <button onClick={() => toggleStatus(item._id, item.isActive)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${item.isActive ? "text-green-600 hover:bg-green-50" : "text-slate-500 hover:bg-slate-100"}`}>
                    {item.isActive ? <FaToggleOn size={14} /> : <FaToggleOff size={14} />}
                    {item.isActive ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition">
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                          <FaGlobeAsia size={14} />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="group relative">
                          <button onClick={() => openModal(item)} aria-label="Edit region" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-orange-50 hover:text-orange-500">
                            <FaEdit size={16} />
                          </button>
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Edit region</span>
                        </div>
                        <div className="group relative">
                          <button onClick={() => toggleStatus(item._id, item.isActive)} aria-label={item.isActive ? "Deactivate region" : "Activate region"} className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${item.isActive ? "text-green-500 hover:bg-green-50 hover:text-green-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}>
                            {item.isActive ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                          </button>
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{item.isActive ? "Set inactive" : "Set active"}</span>
                        </div>
                        <div className="group relative">
                          <button onClick={() => handleDelete(item._id)} aria-label="Delete region" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500">
                            <FaTrash size={16} />
                          </button>
                          <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Delete region</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Region" : "Add Region"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Region Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="North India"
                />
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  {loading ? "Please wait..." : editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Regions;
