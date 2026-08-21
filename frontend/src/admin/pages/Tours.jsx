import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  MapPin,
  Tag,
  Image as ImageIcon,
  Info,
  Flag,
  Plus,
  X,
  Trash2,
  Upload,
  Save,
  Clock,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { FaTimes, FaTrash, FaEdit, FaMapMarkerAlt, FaClock, FaTag, FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminTours,
  updateTour,
  deleteTour,
} from "../../redux/slices/tourSlice";
import { fetchRegions } from "../../redux/slices/regionSlice";
import { fetchStates } from "../../redux/slices/stateSlice";
import { fetchCities } from "../../redux/slices/citySlice";
import { fetchMoods } from "../../redux/slices/moodSlice";
import { fetchDurations } from "../../redux/slices/durationSlice";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600";

const sections = [
  { id: "basic", num: "01", label: "Basic Details", icon: FileText },
  { id: "location", num: "02", label: "Location", icon: MapPin },
  { id: "pricing", num: "03", label: "Pricing", icon: Tag },
  { id: "images", num: "04", label: "Images", icon: ImageIcon },
  { id: "tourinfo", num: "05", label: "Tour Info", icon: Info },
  { id: "flags", num: "06", label: "Flags", icon: Flag },
];

const Toggle = ({ checked, onChange, title, description }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 transition hover:border-[#FF6B00]/40">
    <div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-0.5 text-xs text-slate-500">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        checked ? "bg-[#FF6B00]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  </label>
);

const Tours = () => {
  const dispatch = useDispatch();
  const { adminItems: tours } = useSelector((state) => state.tour);
  const moodOptions = useSelector((state) => state.mood.items);
  const regionOptions = useSelector((state) => state.region.items);
  const stateOptions = useSelector((state) => state.state.items);
  const cityOptions = useSelector((state) => state.city.items);
  const durationOptions = useSelector((state) => state.duration.items);
  const [editingTour, setEditingTour] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [editSection, setEditSection] = useState("basic");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState({ day: "", title: "", description: "", stay: "" });
  const [thumbnail, setThumbnail] = useState(null)
  const [banner, setBanner] = useState(null)
  const [gallery, setGallery] = useState([])
  const [deleteGallery, setDeleteGallery] = useState([]);
  const getMoodName = (moodId) => moodOptions.find((m) => m._id === moodId)?.name || moodId || "";
  const getRegionName = (regionId) => regionOptions.find((r) => r._id === regionId)?.name || regionId || "";
  const getDurationLabel = (durationId) => {
    const d = durationOptions.find((x) => x._id === durationId);
    return d ? `${d.name} (${d.days}D/${d.nights}N)` : durationId || "";
  };
  const openEditModal = (tour) => {
    setEditingTour({
      ...tour,
      price: String(tour.price ?? ""),
      discountPrice: String(tour.discountPrice ?? ""),
    });
    setSubmitted(false);
    setEditSection("basic");
    setNewInclusion("");
    setNewExclusion("");
    setNewItineraryDay({ day: "", title: "", description: "", stay: "" });

  };

  const closeEditModal = () => {
    setEditingTour(null);
    setThumbnail(null);
    setBanner(null);
    setGallery([]);
    setDeleteGallery([]);
    setSubmitted(false);
  };

  const handleEditChange = (field, value) => {
    setEditingTour((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleEditRegionChange = (regionId) => {
    setEditingTour((current) => (current ? { ...current, regionId, stateId: "", cityId: "" } : current));
  };

  const handleEditStateChange = (stateId) => {
    setEditingTour((current) => (current ? { ...current, stateId, cityId: "" } : current));
  };
  const fetchTour = () => {
    dispatch(fetchAdminTours());
  };
  useEffect(() => {
    dispatch(fetchRegions({ isActive: true }));
    dispatch(fetchStates({ isActive: true }));
    dispatch(fetchCities({ isActive: true }));
    dispatch(fetchDurations({ isActive: true }));
    dispatch(fetchMoods({ isActive: true }));
    fetchTour();
  }, [dispatch])
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData()
      data.append("name", editingTour.name)
      data.append("overview", editingTour.overview)
      data.append("description", editingTour.description)
      data.append("regionId", editingTour.regionId)
      data.append("stateId", editingTour.stateId)
      data.append("cityId", editingTour.cityId)
      data.append("moodId", editingTour.moodId)
      data.append("durationId", editingTour.durationId)
      data.append("price", editingTour.price)
      data.append("discountPrice", editingTour.discountPrice)
      data.append("bestTimeToVisit", editingTour.bestTimeToVisit)
      data.append("inclusions", JSON.stringify(editingTour.inclusions))
      data.append("exclusions", JSON.stringify(editingTour.exclusions))
      data.append("itinerary", JSON.stringify(editingTour.itinerary))
      data.append("trending", editingTour.trending)
      data.append("featured", editingTour.featured)
      data.append("isActive", editingTour.isActive)
      if (thumbnail) {
        data.append("thumbnail", thumbnail)
      }
      if (banner) {
        data.append("banner", banner)
      }
      if (gallery.length > 0) {
        gallery.forEach((image) => {
          data.append("gallery", image)
        })
      }
      if (deleteGallery.length > 0) {

        data.append(
          "deleteGallery",
          JSON.stringify(deleteGallery)
        );

      }
      const result = await dispatch(updateTour({ id: editingTour._id, data }));
      if (result.error) {
        throw new Error(result.payload || "Failed to update tour");
      }
      await fetchTour()
      setSubmitted(true);
      setTimeout(closeEditModal, 1200);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteTour = async (id) => {
    try {
      const confirmDelete = (window.confirm("Delete this tour? This action cannot be undone."))
      if (!confirmDelete) {
        return;
      }
      await dispatch(deleteTour(id));
    } catch (error) {
      console.log(error.message)
    }
  };
  const removeNewGalleryImage = (index) => {
    setGallery((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };
  const removeGallery = (fileId) => {
    setDeleteGallery(current => [
      ...current,
      fileId
    ]);
    setEditingTour(current => ({
      ...current,
      gallery: current.gallery.filter(
        image => image.fileId !== fileId
      )
    }));

  }
  const addInclusion = () => {
    if (!newInclusion.trim()) return;
    setEditingTour((current) => ({
      ...current,
      inclusions: [...(current.inclusions || []), newInclusion.trim()],
    }));
    setNewInclusion("");
  };

  const removeInclusion = (index) => {
    setEditingTour((current) => ({
      ...current,
      inclusions: (current.inclusions || []).filter((_, i) => i !== index),
    }));
  };

  const addExclusion = () => {
    if (!newExclusion.trim()) return;
    setEditingTour((current) => ({
      ...current,
      exclusions: [...(current.exclusions || []), newExclusion.trim()],
    }));
    setNewExclusion("");
  };

  const removeExclusion = (index) => {
    setEditingTour((current) => ({
      ...current,
      exclusions: (current.exclusions || []).filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    if (!newItineraryDay.day || !newItineraryDay.title || !newItineraryDay.description) return;
    setEditingTour((current) => ({
      ...current,
      itinerary: [...(current.itinerary || []), { ...newItineraryDay, day: Number(newItineraryDay.day) }],
    }));
    setNewItineraryDay({ day: "", title: "", description: "", stay: "" });
  };

  const removeItineraryDay = (index) => {
    setEditingTour((current) => ({
      ...current,
      itinerary: (current.itinerary || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">Tours</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Tour Catalog</h2>
      </div>

      {tours.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <FaImage className="mx-auto mb-4 text-4xl text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No tours found.</p>
          <p className="text-xs text-slate-400 mt-1">Add your first tour to get started.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => (
            <div key={tour._id} className="rounded-[1.5rem] bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative mb-4">
                <img
                  src={tour?.thumbnail?.url}
                  alt={tour.name}
                  className="h-44 w-full rounded-[1rem] object-cover"
                />
                <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
                  {tour.trending ? (
                    <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">Trending</span>
                  ) : null}
                  {tour.featured ? (
                    <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">Featured</span>
                  ) : null}
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow ${tour.isActive !== false ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                    }`}>
                    {tour.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                  {getMoodName(tour.moodId)}
                </span>
                {tour.durationId ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <FaClock size={11} />
                    {durationOptions.find((d) => d._id === tour.durationId)?.days || ""}D
                  </span>
                ) : null}
              </div>

              <h3 className="text-xl font-black tracking-tight text-slate-900">{tour.name}</h3>

              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                <FaMapMarkerAlt size={12} className="shrink-0 text-slate-400" />
                {[tour.cityName, tour.stateName, tour.regionName].filter(Boolean).join(", ") || "Location not set"}
              </p>

              {tour.overview ? (
                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">{tour.overview}</p>
              ) : null}

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900">
                      ₹{tour.price?.toLocaleString?.() || tour.price || "—"}
                    </span>
                    {tour.discountPrice > 0 ? (
                      <span className="text-xs font-medium text-rose-500 line-through">
                        ₹{tour.discountPrice?.toLocaleString?.() || tour.discountPrice}
                      </span>
                    ) : null}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <FaTag size={10} />{getDurationLabel(tour.durationId)}
                  </span>
                </div>
                <div className="flex w-full gap-2">
                  <button
                    onClick={() => openEditModal(tour)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-100 py-2.5 text-[10px] font-black uppercase text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
                  >
                    <FaEdit size={11} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTour(tour._id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-red-50 py-2.5 text-[10px] font-black uppercase text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <FaTrash size={11} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTour ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FF6B00]">
                  Edit Tour
                </p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-[#0F172A]">
                  Update Tour Details
                </h3>
              </div>
              <button
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                  {sections.map(({ id, num, label, icon: Icon }) => {
                    const isActive = editSection === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setEditSection(id)}
                        className={`flex shrink-0 items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                          isActive
                            ? "bg-[#FF6B00] text-white shadow-md"
                            : "border border-slate-200 bg-[#F8FAFC] text-[#0F172A] hover:border-[#FF6B00]/40 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-black tracking-wider ${
                            isActive ? "text-white/80" : "text-[#FF6B00]"
                          }`}
                        >
                          {num}
                        </span>
                        {label}
                        <Icon
                          size={14}
                          className={isActive ? "text-white/90" : "text-slate-400"}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={editSection}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-6"
                  >
                    {editSection === "basic" && (
                      <>
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                            <FileText size={15} className="text-[#FF6B00]" />
                            Basic Details
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Core information that identifies and introduces the tour.
                          </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <label className={labelClass}>Tour Name *</label>
                            <input value={editingTour.name} onChange={(e) => handleEditChange("name", e.target.value)} className={inputClass} required />
                          </div>
                          <div className="md:col-span-2">
                            <label className={labelClass}>Overview *</label>
                            <textarea value={editingTour.overview || ""} onChange={(e) => handleEditChange("overview", e.target.value)} className={`${inputClass} min-h-20 resize-none`} required />
                          </div>
                          <div className="md:col-span-2">
                            <label className={labelClass}>Description *</label>
                            <textarea value={editingTour.description || ""} onChange={(e) => handleEditChange("description", e.target.value)} className={`${inputClass} min-h-32 resize-none`} required />
                          </div>
                          <div className="md:col-span-2">
                            <label className={labelClass}>Best Time to Visit *</label>
                            <input value={editingTour.bestTimeToVisit || ""} onChange={(e) => handleEditChange("bestTimeToVisit", e.target.value)} className={inputClass} />
                          </div>
                        </div>
                      </>
                    )}

                    {editSection === "location" && (
                      <>
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                            <MapPin size={15} className="text-[#FF6B00]" />
                            Location
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Where the tour starts and the region it covers.
                          </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                          <div>
                            <label className={labelClass}>Region *</label>
                            <select value={editingTour.regionId || ""} onChange={(e) => handleEditRegionChange(e.target.value)} className={inputClass}>
                              <option value="">Select Region</option>
                              {regionOptions.map((r) => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>State *</label>
                            <select value={editingTour.stateId || ""} onChange={(e) => handleEditStateChange(e.target.value)} className={inputClass} disabled={!editingTour.regionId}>
                              <option value="">{editingTour.regionId ? "Select State" : "Select Region First"}</option>
                              {stateOptions.filter((s) => (s.regionId?._id || s.regionId) === editingTour.regionId).map((s) => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>City *</label>
                            <select value={editingTour.cityId || ""} onChange={(e) => handleEditChange("cityId", e.target.value)} className={inputClass} disabled={!editingTour.stateId}>
                              <option value="">{editingTour.stateId ? "Select City" : "Select State First"}</option>
                              {cityOptions.filter((c) => (c.stateId?._id || c.stateId) === editingTour.stateId).map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Mood / Category *</label>
                            <select value={editingTour.moodId || ""} onChange={(e) => handleEditChange("moodId", e.target.value)} className={inputClass}>
                              <option value="">Select Mood</option>
                              {moodOptions.map((m) => (
                                <option key={m._id} value={m._id}>{m.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Duration *</label>
                            <select value={editingTour.durationId || ""} onChange={(e) => handleEditChange("durationId", e.target.value)} className={inputClass}>
                              <option value="">Select Duration</option>
                              {durationOptions.map((d) => (
                                <option key={d._id} value={d._id}>{d.name} ({d.days}D/{d.nights}N)</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {editSection === "pricing" && (
                      <>
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                            <Tag size={15} className="text-[#FF6B00]" />
                            Pricing
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Set the base price and optional discounted offer price.
                          </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <label className={labelClass}>Price (₹) *</label>
                            <input type="number" min="0" value={editingTour.price} onChange={(e) => handleEditChange("price", e.target.value)} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Offer Price (₹)</label>
                            <input type="number" min="0" value={editingTour.discountPrice || ""} onChange={(e) => handleEditChange("discountPrice", e.target.value)} className={inputClass} placeholder="Optional" />
                          </div>
                        </div>
                      </>
                    )}

                    {editSection === "images" && (
                      <>
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                            <ImageIcon size={15} className="text-[#FF6B00]" />
                            Images
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Replace or add images. Current images are shown below.
                          </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <label className={labelClass}>Thumbnail</label>
                            {editingTour.thumbnail?.url ? (
                              <div className="relative mb-3 overflow-hidden rounded-2xl border border-slate-200">
                                <img src={editingTour.thumbnail.url} alt="Thumbnail" className="h-40 w-full object-cover" />
                                <span className="absolute bottom-2 left-2 rounded-md bg-[#0F172A]/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Current</span>
                              </div>
                            ) : null}
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#FF6B00]">
                              <Upload size={18} className="text-[#FF6B00]" />
                              <span className="text-sm font-semibold text-slate-700">Replace thumbnail</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                              />
                            </label>
                          </div>

                          <div>
                            <label className={labelClass}>Banner</label>
                            {editingTour.banner?.url ? (
                              <div className="relative mb-3 overflow-hidden rounded-2xl border border-slate-200">
                                <img src={editingTour.banner.url} alt="Banner" className="h-40 w-full object-cover" />
                                <span className="absolute bottom-2 left-2 rounded-md bg-[#0F172A]/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Current</span>
                              </div>
                            ) : null}
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#FF6B00]">
                              <Upload size={18} className="text-[#FF6B00]" />
                              <span className="text-sm font-semibold text-slate-700">Replace banner</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setBanner(e.target.files[0])}
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Current Gallery</label>
                          {editingTour.gallery?.length ? (
                            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                              {editingTour.gallery.map((image) => (
                                <div key={image.fileId} className="group relative overflow-hidden rounded-xl border border-slate-200">
                                  <img src={image.url} alt="" className="h-24 w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeGallery(image.fileId)}
                                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F172A]/70 text-white transition hover:bg-red-500"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-slate-400">No gallery images.</p>
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>Add New Gallery Images</label>
                          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#FF6B00]">
                            <Upload size={18} className="text-[#FF6B00]" />
                            <span className="text-sm font-semibold text-slate-700">Upload new images</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const newFiles = [...e.target.files];
                                setGallery((prev) => [...prev, ...newFiles]);
                              }}
                            />
                          </label>

                          {gallery.length > 0 ? (
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                              {gallery.map((file, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-xl border border-slate-200">
                                  <img src={URL.createObjectURL(file)} alt="" className="h-24 w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeNewGalleryImage(index)}
                                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F172A]/70 text-white transition hover:bg-red-500"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                  <span className="absolute bottom-1.5 left-1.5 rounded-md bg-[#FF6B00] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">New</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </>
                    )}

                    {editSection === "tourinfo" && (
                      <>
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                            <Info size={15} className="text-[#FF6B00]" />
                            Tour Info
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Inclusions, exclusions and the day-by-day itinerary.
                          </p>
                        </div>

                        <div>
                          <label className={labelClass}>Inclusions</label>
                          <div className="mb-2 flex gap-2">
                            <input value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)} className={inputClass} placeholder="e.g. Hotel accommodation" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())} />
                            <button type="button" onClick={addInclusion} className="shrink-0 rounded-xl bg-[#FF6B00] px-4 text-white transition hover:bg-[#e65f00]"><Plus size={16} /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(editingTour.inclusions || []).map((item, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                                <CheckCircle2 size={12} />
                                {item}
                                <button type="button" onClick={() => removeInclusion(i)} className="text-emerald-500 transition hover:text-red-500"><X size={10} /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Exclusions</label>
                          <div className="mb-2 flex gap-2">
                            <input value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)} className={inputClass} placeholder="e.g. Flight tickets" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())} />
                            <button type="button" onClick={addExclusion} className="shrink-0 rounded-xl bg-[#FF6B00] px-4 text-white transition hover:bg-[#e65f00]"><Plus size={16} /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(editingTour.exclusions || []).map((item, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                                <Ban size={12} />
                                {item}
                                <button type="button" onClick={() => removeExclusion(i)} className="text-red-400 transition hover:text-red-600"><X size={10} /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Itinerary</label>
                          <div className="mb-3 space-y-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                            <div className="grid gap-3 md:grid-cols-3">
                              <input type="number" min="1" value={newItineraryDay.day} onChange={(e) => setNewItineraryDay((p) => ({ ...p, day: e.target.value }))} className={inputClass} placeholder="Day" />
                              <input value={newItineraryDay.title} onChange={(e) => setNewItineraryDay((p) => ({ ...p, title: e.target.value }))} className={inputClass} placeholder="Title" />
                              <input value={newItineraryDay.stay} onChange={(e) => setNewItineraryDay((p) => ({ ...p, stay: e.target.value }))} className={inputClass} placeholder="Stay (optional)" />
                            </div>
                            <textarea value={newItineraryDay.description} onChange={(e) => setNewItineraryDay((p) => ({ ...p, description: e.target.value }))} className={`${inputClass} min-h-16 resize-none`} placeholder="Day description" />
                            <button type="button" onClick={addItineraryDay} className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#e65f00]"><Plus size={14} /> Add Day</button>
                          </div>
                          <div className="space-y-2">
                            {(editingTour.itinerary || []).map((day, i) => (
                              <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6B00]/10 text-[#FF6B00]"><Clock size={14} /></span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-800">Day {day.day} — {day.title}</p>
                                  <p className="mt-0.5 text-xs text-slate-500">{day.description}</p>
                                  {day.stay ? <p className="mt-0.5 text-xs text-slate-400">Stay: {day.stay}</p> : null}
                                </div>
                                <button type="button" onClick={() => removeItineraryDay(i)} className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"><FaTrash size={12} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {editSection === "flags" && (
                      <>
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                            <Flag size={15} className="text-[#FF6B00]" />
                            Tour Flags
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Control how this tour is promoted and shown on the website.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Toggle
                            title="Trending"
                            description="Mark this tour as trending"
                            checked={editingTour.trending || false}
                            onChange={(checked) => handleEditChange("trending", checked)}
                          />
                          <Toggle
                            title="Featured"
                            description="Show this tour in featured section"
                            checked={editingTour.featured || false}
                            onChange={(checked) => handleEditChange("featured", checked)}
                          />
                          <Toggle
                            title="Active"
                            description="Tour is visible on the website"
                            checked={editingTour.isActive !== false}
                            onChange={(checked) => handleEditChange("isActive", checked)}
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-slate-200 px-6 py-5">
                <p className="text-sm text-slate-500">Tour will be saved locally.</p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF6B00]"
                >
                  <Save size={15} />
                  {submitted ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Tours;
