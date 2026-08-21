import { useState, useEffect } from "react";
import {
  FaSmile,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMoods,
  createMood,
  updateMood,
  deleteMood,
  updateMoodStatus,
} from "../../redux/slices/moodSlice";
const Moods = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.mood);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", image: null });
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !formData.image) {
      setError("Please upload a mood image.");
      return;
    }
    const payload = new FormData();
    payload.append("name", formData.name);
    if (formData.image) {
      payload.append("image", formData.image);
    }
    try {
      const result = editingId
        ? await dispatch(updateMood({ id: editingId, data: payload }))
        : await dispatch(createMood(payload));
      if (result.error) {
        throw new Error(result.payload || "Failed to save mood");
      }
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };
  useEffect(() => {
    dispatch(fetchMoods());
  }, [dispatch]);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this mood?");
    if (!confirmDelete) {
      return;
    }
    try {
      dispatch(deleteMood(id));
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleStatus = async (id, current) => {
    try {
      const result = await dispatch(
        updateMoodStatus({ id, isActive: !current }),
      );
      if (result.error) {
        throw new Error(result.payload || "Failed to update mood status");
      }
      if (activeFilter !== "all") {
        dispatch(fetchMoods({ isActive: activeFilter === "active" }));
      }
    } catch (error) {
      setError(error.message || "Failed to update mood status");
    }
  };
  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({ name: item.name, image: null });
      setImagePreview(item.moodImage?.url || "");
    } else {
      setEditingId(null);
      setFormData({ name: "", image: null });
      setImagePreview("");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setImagePreview("");
    setError("");
  };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Moods</h1>
          <p className="text-sm text-slate-500">Manage tour moods and vibes</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FaPlus size={12} /> Add Mood
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveFilter("all");
            dispatch(fetchMoods());
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
            dispatch(fetchMoods({ isActive: true }));
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
            dispatch(fetchMoods({ isActive: false }));
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
          No moods yet. Add one to get started.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {items.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  {item.moodImage?.url ? (
                    <img src={item.moodImage.url} alt={item.name} className="h-10 w-10 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <FaSmile size={16} />
                    </div>
                  )}
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
                        {item.moodImage?.url ? (
                          <img src={item.moodImage.url} alt={item.name} className="h-9 w-9 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                            <FaSmile size={14} />
                          </div>
                        )}
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
                        <button onClick={() => openModal(item)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-orange-500"><FaEdit size={14} /></button>
                        <button onClick={() => toggleStatus(item._id, item.isActive)} className={`rounded-lg p-2 hover:bg-slate-100 transition ${item.isActive ? "text-green-600 hover:text-green-700" : "text-red-500 hover:text-red-600"}`}>
                          {item.isActive ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
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
                {editingId ? "Edit Mood" : "Add Mood"}
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
                  Mood Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="Adventure"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Mood Image {editingId ? "" : "*"}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-orange-600 hover:file:bg-orange-100"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {editingId ? "Leave empty to keep the current image." : "JPG, PNG or WEBP up to 10MB."}
                </p>
                {imagePreview ? (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img src={imagePreview} alt="Mood preview" className="h-32 w-full object-cover" />
                  </div>
                ) : null}
              </div>
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              ) : null}
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

export default Moods;
