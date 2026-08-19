import { useEffect, useState } from "react";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialStatus,
} from "../../redux/slices/testimonialSlice";

const Testimonials = () => {
  const dispatch = useDispatch();
  const { adminItems: items } = useSelector((state) => state.testimonial);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    text: "",
    rating: "",
    isVerified: true,
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredItems = items.filter((item) => {
    if (activeFilter === "active") return item.isActive;
    if (activeFilter === "inactive") return !item.isActive;
    return true;
  });
  const fetchtestimonial = () => {
    dispatch(fetchAdminTestimonials());
  };
  useEffect(() => {
    fetchtestimonial();
  }, [dispatch]);
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile && !editingId) {
      toast.error("Please upload testimonial image");
      return;
    }
    try {
      setLoading(true)
      let data = new FormData()
      data.append("name", formData.name)
      data.append("location", formData.location)
      data.append("text", formData.text)
      data.append("rating", formData.rating)
      if (imageFile) {
        data.append("image", imageFile)
      }
      const result = editingId
        ? await dispatch(updateTestimonial({ id: editingId, data }))
        : await dispatch(createTestimonial(data));
      if (result.error) {
        throw new Error(result.payload || "Failed to save testimonial");
      }
      await fetchtestimonial()
      closeModal()
      toast.success(editingId ? "Testimonial update successfully" : "Testimonial created successfully")
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      )
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = async (id) => {
    try {
      const confirmDelete = (window.confirm("Delete this testimonials? This action cannot be undone."))
      if (!confirmDelete) {
        return;
      }
      await dispatch(deleteTestimonial(id));
      toast.success("Deleted successfully")
      await fetchtestimonial()
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      )
    }
  }
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      let newStatus = !currentStatus
      const result = await dispatch(updateTestimonialStatus({ id, isActive: newStatus }));
      if (result.error) {
        throw new Error(result.payload || "Failed to update status");
      }
      await fetchtestimonial()
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || error.message);
    }
  }
  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        name: item.name,
        location: item.location,
        text: item.text,
        rating: item.rating,
        isVerified: item.isVerified,
      });
      setImagePreview(item.image.url);
      setImageFile(null);
    } else {
      setEditingId(null);
      setFormData({ name: "", location: "", text: "", rating: 5, isVerified: true });
      setImagePreview("");
      setImageFile(null);
    }
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setImagePreview("");
    setImageFile(null);
    setFormData({
      name: "",
      location: "",
      text: "",
      rating: "",
      isVerified: true,
    })
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Testimonials</h1>
          <p className="text-sm text-slate-500">Manage customer testimonials and reviews</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FaPlus size={12} /> Add Testimonial
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeFilter === "all"
            ? "bg-orange-500 text-white"
            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("active")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeFilter === "active"
            ? "bg-orange-500 text-white"
            : "border border-slate-200 bg-white text-slate-600 hover:bg-green-50"
            }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter("inactive")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeFilter === "inactive"
            ? "bg-orange-500 text-white"
            : "border border-slate-200 bg-white text-slate-600 hover:bg-red-50"
            }`}
        >
          Inactive
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FaStar className="mx-auto mb-3 text-slate-300" size={32} />
          <p className="text-sm text-slate-500">No testimonials yet. Add one to get started.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredItems.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                      {item.isVerified && (
                        <FaCheckCircle className="shrink-0 text-emerald-500" size={12} />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <FaMapMarkerAlt className="shrink-0 text-orange-400" size={10} />
                      {item.location}
                    </p>
                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          size={11}
                          className={i < item.rating ? "text-yellow-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">{item.text}</p>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <button onClick={() => openModal(item)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-500 transition">
                    <FaEdit size={12} /> Edit
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(item._id, item.isActive)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${item.isActive ? "text-green-600 hover:bg-green-50" : "text-slate-500 hover:bg-slate-50"
                        }`}>
                      {item.isActive ? <FaToggleOn size={14} /> : <FaToggleOff size={14} />}
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => { handleDelete(item._id) }}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition">
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 w-[220px]">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Review</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 w-[130px]">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 w-[110px]">Verified</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 w-[100px]">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500 w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image.url}
                          alt={item.name}
                          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                            <FaMapMarkerAlt className="shrink-0 text-orange-400" size={9} />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate" title={item.text}>{item.text}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            size={13}
                            className={i < item.rating ? "text-yellow-400" : "text-slate-200"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-600 whitespace-nowrap">
                          <FaCheckCircle size={10} /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal(item)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-orange-500 transition"><FaEdit size={14} /></button>
                        <button
                          onClick={() => handleToggleStatus(item._id, item.isActive)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-green-500 transition">
                          {item.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition"><FaTrash size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )
      }

      {
        showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  {editingId ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="Karan Malhotra"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="Delhi, India"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Review *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none resize-none"
                    placeholder="Write the testimonial..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Avatar URL</label>
                  <input
                    type="file"
                    accept="image"
                    onChange={handleImageUpload}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="https://i.pravatar.cc/160?img=12"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 h-12 w-12 rounded-full object-cover ring-2 ring-white"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="transition hover:scale-110"
                        >
                          <FaStar
                            size={20}
                            className={star <= formData.rating ? "text-yellow-400" : "text-slate-200"}
                          />
                        </button>
                      ))}
                      <span className="ml-1 text-xs font-medium text-slate-500">({formData.rating}/5)</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Verified</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVerified: !formData.isVerified })}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        formData.isVerified
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <FaCheckCircle size={14} className={formData.isVerified ? "text-emerald-500" : "text-slate-300"} />
                      {formData.isVerified ? "Verified" : "Not Verified"}
                    </button>
                  </div>
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
                    {editingId ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Testimonials;
