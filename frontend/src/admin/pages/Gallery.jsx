import { useState, useEffect, useRef } from "react";
import {
  FaImages,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaUpload,
} from "react-icons/fa";
import { API_URI } from "../../config/config";
import axios from "axios";

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    moodId: "",
    order: "",
    images: [],
  });
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [moods, setMoods] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilterValue, setActiveFilterValue] = useState(undefined);
  const fileInputRef = useRef(null);

  const fetchGallery = async (isActive) => {
    const token = localStorage.getItem("token");
    try {
      const params = {};
      const activeParam = isActive !== undefined ? isActive : activeFilterValue;
      if (activeParam !== undefined) params.isActive = activeParam;
      if (search.trim()) params.search = search.trim();
      const response = await axios.get(`${API_URI}/gallery/admin/all`, {
        headers: { authorization: `Bearer ${token}` },
        params,
      });
      setItems(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const fetchMoods = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URI}/mood`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setMoods(response.data.mood || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchMoods();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchGallery(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingId) {
        const hasNewImage = formData.images.length > 0;
        if (hasNewImage) {
          const fd = new FormData();
          fd.append("image", formData.images[0].file);
          fd.append("moodId", formData.moodId);
          fd.append("order", formData.order || 0);
          const response = await axios.put(`${API_URI}/gallery/${editingId}`, fd, { headers });
          setItems((prev) =>
            prev.map((item) => (item._id === editingId ? response.data.data : item))
          );
        } else {
          const response = await axios.put(
            `${API_URI}/gallery/${editingId}`,
            { moodId: formData.moodId, order: Number(formData.order) || 0 },
            { headers }
          );
          setItems((prev) =>
            prev.map((item) => (item._id === editingId ? response.data.data : item))
          );
        }
      } else {
        const fd = new FormData();
        fd.append("moodId", formData.moodId);
        fd.append("order", formData.order || 0);
        formData.images.forEach((item) => fd.append("images", item.file));
        const response = await axios.post(`${API_URI}/gallery`, fd, { headers });
        setItems((prev) => [...response.data.data, ...prev]);
      }
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this gallery image?");
    if (!confirmDelete) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URI}/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URI}/gallery/${id}`,
        { isActive: !current },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (activeFilter === "all") {
        setItems((prev) =>
          prev.map((item) => (item._id === id ? response.data.data : item))
        );
      } else {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        moodId: item.moodId?._id || item.moodId || "",
        order: String(item.order ?? 0),
        images: [],
        previewUrl: item.url,
      });
    } else {
      setEditingId(null);
      setFormData({ moodId: "", order: "", images: [], previewUrl: null });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ moodId: "", order: "", images: [], previewUrl: null });
    setError("");
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)
    );
    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));
  };

  const handleImageChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const removeFromQueue = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const filteredItems = items;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gallery</h1>
          <p className="text-sm text-slate-500">Manage gallery images and moods</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FaPlus size={12} /> Add Image
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveFilter("all"); setActiveFilterValue(undefined); fetchGallery(); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeFilter === "all"
                ? "bg-orange-500 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
          >
            All
          </button>
          <button
            onClick={() => { setActiveFilter("active"); setActiveFilterValue(true); fetchGallery(true); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeFilter === "active"
                ? "bg-orange-500 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-green-50"
              }`}
          >
            Active
          </button>
          <button
            onClick={() => { setActiveFilter("inactive"); setActiveFilterValue(false); fetchGallery(false); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeFilter === "inactive"
                ? "bg-orange-500 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-red-50"
              }`}
          >
            Inactive
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by alt text or mood..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none w-full sm:w-64"
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          <FaImages className="mx-auto mb-3 text-3xl text-slate-300" />
          No gallery images yet. Add one to get started.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredItems.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.alt}</p>
                    <p className="text-xs text-slate-400 truncate">Mood: {item.moodName}</p>
                    <p className="text-xs text-slate-400">Order: {item.order}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button onClick={() => openModal(item)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-500 transition">
                    <FaEdit size={12} /> Edit
                  </button>
                  <button onClick={() => toggleStatus(item._id, item.isActive)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${item.isActive ? "text-green-600 hover:bg-green-50" : "text-slate-500 hover:bg-slate-100"
                    }`}>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Alt Text</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Mood</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                        <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 max-w-[200px] truncate">{item.alt}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.moodName}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.order}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal(item)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-orange-500"><FaEdit size={14} /></button>
                        <button onClick={() => toggleStatus(item._id, item.isActive)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-green-500">
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
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Gallery Image" : "Add Gallery Images"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Images {!editingId && "*"}
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-orange-500", "bg-orange-50"); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-orange-500", "bg-orange-50"); }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-orange-500", "bg-orange-50"); handleFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center hover:border-orange-500 transition-colors"
                >
                  {formData.previewUrl ? (
                    <img src={formData.previewUrl} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                  ) : formData.images.length > 0 ? (
                    <>
                      <FaUpload className="text-2xl text-orange-500" />
                      <p className="text-sm font-medium text-slate-700">Drop more images or click to add</p>
                      <p className="text-xs text-slate-400">{formData.images.length} file(s) selected</p>
                    </>
                  ) : (
                    <>
                      <FaUpload className="text-2xl text-slate-400" />
                      <p className="text-sm text-slate-500">Drag and drop images here, or click to browse</p>
                      <p className="text-xs text-slate-400">Supports JPEG, PNG, WebP</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {formData.images.length > 0 && !editingId && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-slate-500">PREVIEW ({formData.images.length} files)</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {formData.images.map((item, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                          <img src={item.preview} alt="Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFromQueue(index)}
                            className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Mood *
                </label>
                <select
                  required
                  value={formData.moodId}
                  onChange={(e) => setFormData({ ...formData, moodId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select a mood</option>
                  {moods.map((mood) => (
                    <option key={mood._id} value={mood._id}>
                      {mood.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="0"
                />
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

export default Gallery;
