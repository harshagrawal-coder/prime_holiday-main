import { useState, useRef } from "react";
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
import axios from "axios";
import { API_URI } from "../../config/config";
import { useEffect } from "react";
const HeroHomePage = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  // const [imageFile,setImageFile] = useState("")
  const [formData, setFormData] = useState({
    alt: "",
    order: "",
    isActive: "",
    images: [],
  });
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const fileInputRef = useRef(null);
  const filteredItems = items.filter((item) => {
    if (activeFilter === "active") return item.isActive;
    if (activeFilter === "inactive") return !item.isActive;
    return true;
  });
  const fetchHeroImage = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URI}/herohomepage/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setItems(response.data.data);
  };
  useEffect(() => {
    fetchHeroImage();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("alt", formData.alt);
    data.append("order", formData.order);
    data.append("isActive", formData.isActive);
    if (formData.images.length > 0) {
      data.append("image", formData.images[0].file);
    }
    const token = localStorage.getItem("token");
    if (editingId) {
      const response = await axios.put(
        `${API_URI}/herohomepage/${editingId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } else {
      const response = await axios.post(`${API_URI}/herohomepage`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }
    await fetchHeroImage();
    closeModal();
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this hero image?");
    if (!confirmDelete) return;
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URI}/herohomepage/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const toggleStatus = (id, current) => {
    setItems((prev) =>
      activeFilter === "all"
        ? prev.map((item) =>
            item._id === id ? { ...item, isActive: !current } : item,
          )
        : prev.filter((item) => item._id !== id),
    );
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        alt: item.image.alt || "",
        order: String(item.order ?? 0),
        isActive: item.isActive,
        images: [],
      });
    } else {
      setEditingId(null);
      setFormData({ alt: "", order: "", isActive: true, images: [] });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ alt: "", order: "", isActive: true, images: [] });
    setError("");
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type),
    );
    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      images: editingId ? [...newFiles] : [...prev.images, ...newFiles],
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

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Homepage Hero</h1>
          <p className="text-sm text-slate-500">
            Manage hero homepage slider images
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FaPlus size={12} /> Add Hero Image
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "all"
              ? "bg-orange-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("active")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "active"
              ? "bg-orange-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-green-50"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter("inactive")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "inactive"
              ? "bg-orange-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-red-50"
          }`}
        >
          Inactive
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          <FaImages className="mx-auto mb-3 text-3xl text-slate-300" />
          No hero images yet. Add one to get started.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={item.image.url}
                      alt={item.image.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.image.alt}
                    </p>
                    <p className="text-xs text-slate-400">
                      Order: {item.order}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      item.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => openModal(item)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-orange-50 hover:text-orange-500"
                  >
                    <FaEdit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(item._id, item.isActive)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      item.isActive
                        ? "text-green-600 hover:bg-green-50"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {item.isActive ? (
                      <FaToggleOn size={14} />
                    ) : (
                      <FaToggleOff size={14} />
                    )}
                    {item.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Alt Text
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={item.image.url}
                          alt={item.image.alt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-sm font-medium text-slate-800">
                      {item.image.alt}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {item.order}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(item)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-orange-500"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => toggleStatus(item._id, item.isActive)}
                          className={`rounded-lg p-2 transition ${
                            item.isActive
                              ? "text-green-600 hover:bg-slate-100 hover:text-green-700"
                              : "text-red-500 hover:bg-slate-100 hover:text-red-600"
                          }`}
                        >
                          {item.isActive ? (
                            <FaToggleOn size={22} />
                          ) : (
                            <FaToggleOff size={22} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                        >
                          <FaTrash size={14} />
                        </button>
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
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Hero Image" : "Add Hero Images"}
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
                  Images {!editingId && "*"}
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(
                      "border-orange-500",
                      "bg-orange-50",
                    );
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                      "border-orange-500",
                      "bg-orange-50",
                    );
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                      "border-orange-500",
                      "bg-orange-50",
                    );
                    handleFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-orange-500"
                >
                  {editingId ? (
                    <>
                      <FaUpload className="text-2xl text-orange-500" />
                      <p className="text-sm font-medium text-slate-700">
                        Click to replace image (optional)
                      </p>
                    </>
                  ) : formData.images.length > 0 ? (
                    <>
                      <FaUpload className="text-2xl text-orange-500" />
                      <p className="text-sm font-medium text-slate-700">
                        Drop more images or click to add
                      </p>
                      <p className="text-xs text-slate-400">
                        {formData.images.length} file(s) selected
                      </p>
                    </>
                  ) : (
                    <>
                      <FaUpload className="text-2xl text-slate-400" />
                      <p className="text-sm text-slate-500">
                        Drag and drop images here, or click to browse
                      </p>
                      <p className="text-xs text-slate-400">
                        Supports JPEG, PNG, WebP
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={!editingId}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {formData.images.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      PREVIEW ({formData.images.length} file
                      {formData.images.length > 1 ? "s" : ""})
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {formData.images.map((item, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200"
                        >
                          <img
                            src={item.preview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFromQueue(index)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
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
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) =>
                    setFormData({ ...formData, alt: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="e.g. Himalayan valley at sunrise"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="1"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Slides are displayed in ascending order.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-700">Active</p>
                  <p className="text-[11px] text-slate-400">
                    Show this slide on the homepage slider
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    formData.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </button>
              </div>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}
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
export default HeroHomePage;
