import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStates,
  createState,
  updateState,
  deleteState,
  updateStateStatus,
} from "../../redux/slices/stateSlice";
import { fetchRegions } from "../../redux/slices/regionSlice";

const States = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.state);
  const { items: regions } = useSelector((state) => state.region);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", regionId: "" });
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = editingId
        ? await dispatch(updateState({ id: editingId, data: formData }))
        : await dispatch(createState(formData));
      if (result.error) {
        throw new Error(result.payload || "failed to save state");
      }
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    dispatch(fetchRegions({ isActive: true }));
    dispatch(fetchStates());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this state?",
    );
    if (!confirmDelete) {
      return;
    }
    dispatch(deleteState(id));
  };
  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({ name: item.name, regionId: item.regionId });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        regionId: regions.length > 0 ? regions[0]._id : "",
      });
    }
    setShowModal(true);
  };
  const toggleStatus = async (id, current) => {
    try {
      const result = await dispatch(
        updateStateStatus({ id, isActive: !current }),
      );
      if (result.error) {
        throw new Error(result.payload || "Failed to update state");
      }
      if (activeFilter !== "all") {
        dispatch(fetchStates({ isActive: activeFilter === "active" }));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">States</h1>
          <p className="text-sm text-slate-500">
            Manage states under geographic regions
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FaPlus size={12} /> Add State
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveFilter("all");
            dispatch(fetchStates());
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition
      ${
        activeFilter === "all"
          ? "bg-orange-500 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
        >
          All
        </button>

        <button
          onClick={() => {
            setActiveFilter("active");
            dispatch(fetchStates({ isActive: true }));
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition
      ${
        activeFilter === "active"
          ? "bg-orange-500 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-green-50"
      }`}
        >
          Active
        </button>

        <button
          onClick={() => {
            setActiveFilter("inactive");
            dispatch(fetchStates({ isActive: false }));
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition
      ${
        activeFilter === "inactive"
          ? "bg-orange-500 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-red-50"
      }`}
        >
          Inactive
        </button>
      </div>
      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No states yet. Add one to get started.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {items.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 truncate">{item.slug}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    {item?.regionId?.name || "No region"}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Region</th>
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
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <FaMapMarkerAlt size={14} />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{item?.regionId?.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal(item)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-orange-500"><FaEdit size={14} /></button>
                        <button onClick={() => toggleStatus(item._id, item.isActive)} className={`rounded-lg p-2 transition ${item.isActive ? "text-green-600 hover:bg-green-100" : "text-red-500 hover:bg-red-100"}`}>
                          {item.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500"><FaTrash size={14} /></button>
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
                {editingId ? "Edit State" : "Add State"}
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
                  State Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="Uttarakhand"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Region *
                </label>
                <select
                  required
                  value={formData.regionId}
                  onChange={(e) =>
                    setFormData({ ...formData, regionId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select Region</option>
                  {regions.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
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
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default States;
