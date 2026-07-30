import axios from "axios";
import { useEffect, useState } from "react";
import { FaTimes, FaTrash, FaEdit, FaCheck, FaMapMarkerAlt, FaClock, FaTag, FaImage, FaPlus } from "react-icons/fa";
import { API_URI } from "../../config/config";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600";

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [editSection, setEditSection] = useState("basic");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState({ day: "", title: "", description: "", stay: "" });
  const [moodOptions, setMoodOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
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
  const fetchTour = async () => {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${API_URI}/tour/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    setTours(response.data.data)
    // console.log(response.data.data[0])

  }
  const fetchRegions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URI}/region?isActive=true`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch regions");
      }
      setRegionOptions(data.regions);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchState = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URI}/state?isActive=true`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch states");
      }
      setStateOptions(data.states);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchCity = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URI}/city?isActive=true`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cities");
      }
      setCityOptions(data.cities)
    } catch (error) {
      console.log(error.message)
    }
  }
  const fetchMood = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URI}/mood?isActive=true`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cities");
      }
      setMoodOptions(data.mood)
    } catch (error) {
      console.log(error.message)
    }
  }
  const fetchDuration = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URI}/duration?isActive=true`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch duration");
      }
      setDurationOptions(data.durations)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    fetchRegions()
    fetchState()
    fetchCity()
    fetchDuration()
    fetchMood()
    fetchTour()
  }, [])
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
      const token = localStorage.getItem("token")
      const response = await axios.put(`${API_URI}/tour/${editingTour._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`
        }
      })
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
      const token = localStorage.getItem("token")
      const response = await axios.delete(`${API_URI}/tour/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
     await fetchTour()
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Edit Tour</h3>
              <button onClick={closeEditModal} className="p-2 text-slate-400 hover:text-slate-900">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "basic", label: "Basic Details" },
                  { id: "location", label: "Location & Mood" },
                  { id: "pricing", label: "Pricing" },
                  { id: "tourinfo", label: "Inclusions & Itinerary" },
                  { id: "flags", label: "Flags" },
                  { id: "images", label: "Images" },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setEditSection(sec.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition ${editSection === sec.id
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {editSection === "basic" && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Tour Name *</label>
                    <input value={editingTour.name} onChange={(e) => handleEditChange("name", e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Overview *</label>
                    <textarea value={editingTour.overview || ""} onChange={(e) => handleEditChange("overview", e.target.value)} className={`${inputClass} min-h-20 resize-none`} required />
                  </div>
                  <div>
                    <label className={labelClass}>Description *</label>
                    <textarea value={editingTour.description || ""} onChange={(e) => handleEditChange("description", e.target.value)} className={`${inputClass} min-h-28 resize-none`} required />
                  </div>
                  <div>
                    <label className={labelClass}>Best Time to Visit *</label>
                    <input value={editingTour.bestTimeToVisit || ""} onChange={(e) => handleEditChange("bestTimeToVisit", e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}

              {editSection === "location" && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
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
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
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
                </div>
              )}

              {editSection === "pricing" && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Base Price (₹) *</label>
                      <input type="number" min="0" value={editingTour.price} onChange={(e) => handleEditChange("price", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Discount Price (₹)</label>
                      <input type="number" min="0" value={editingTour.discountPrice || ""} onChange={(e) => handleEditChange("discountPrice", e.target.value)} className={inputClass} placeholder="Optional" />
                    </div>
                  </div>
                </div>
              )}

              {editSection === "tourinfo" && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Inclusions</label>
                    <div className="flex gap-2 mb-2">
                      <input value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)} className={inputClass} placeholder="e.g. Hotel accommodation" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())} />
                      <button type="button" onClick={addInclusion} className="shrink-0 rounded-xl bg-orange-500 px-4 text-white hover:bg-orange-600 transition"><FaPlus size={12} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editingTour.inclusions || []).map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                          {item}
                          <button type="button" onClick={() => removeInclusion(i)} className="text-emerald-500 hover:text-red-500"><FaTimes size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Exclusions</label>
                    <div className="flex gap-2 mb-2">
                      <input value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)} className={inputClass} placeholder="e.g. Flight tickets" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())} />
                      <button type="button" onClick={addExclusion} className="shrink-0 rounded-xl bg-orange-500 px-4 text-white hover:bg-orange-600 transition"><FaPlus size={12} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editingTour.exclusions || []).map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                          {item}
                          <button type="button" onClick={() => removeExclusion(i)} className="text-red-400 hover:text-red-600"><FaTimes size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Itinerary</label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 mb-3">
                      <div className="grid gap-3 md:grid-cols-4">
                        <input type="number" min="1" value={newItineraryDay.day} onChange={(e) => setNewItineraryDay((p) => ({ ...p, day: e.target.value }))} className={inputClass} placeholder="Day" />
                        <input value={newItineraryDay.title} onChange={(e) => setNewItineraryDay((p) => ({ ...p, title: e.target.value }))} className={inputClass} placeholder="Title" />
                        <input value={newItineraryDay.stay} onChange={(e) => setNewItineraryDay((p) => ({ ...p, stay: e.target.value }))} className={inputClass} placeholder="Stay (optional)" />
                      </div>
                      <textarea value={newItineraryDay.description} onChange={(e) => setNewItineraryDay((p) => ({ ...p, description: e.target.value }))} className={`${inputClass} min-h-16 resize-none`} placeholder="Description" />
                      <button type="button" onClick={addItineraryDay} className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition">Add Day</button>
                    </div>
                    <div className="space-y-2">
                      {(editingTour.itinerary || []).map((day, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-600">D{day.day}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800">{day.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{day.description}</p>
                            {day.stay ? <p className="text-xs text-slate-400 mt-0.5">Stay: {day.stay}</p> : null}
                          </div>
                          <button type="button" onClick={() => removeItineraryDay(i)} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"><FaTrash size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {editSection === "flags" && (
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingTour.trending || false} onChange={(e) => handleEditChange("trending", e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Trending</span>
                      <p className="text-xs text-slate-500">Mark as trending</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingTour.featured || false} onChange={(e) => handleEditChange("featured", e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Featured</span>
                      <p className="text-xs text-slate-500">Show in featured section</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingTour.isActive !== false} onChange={(e) => handleEditChange("isActive", e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Active</span>
                      <p className="text-xs text-slate-500">Visible on website</p>
                    </div>
                  </label>
                </div>
              )}
              {editSection === "images" && (
                <div className="space-y-6">

                  {/* Thumbnail */}
                  <div>
                    <label className={labelClass}>Thumbnail</label>

                    {editingTour.thumbnail?.url && (
                      <img
                        src={editingTour.thumbnail.url}
                        alt="Thumbnail"
                        className="mb-3 h-40 w-full rounded-xl object-cover border"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                      className={inputClass}
                    />
                  </div>

                  {/* Banner */}
                  <div>
                    <label className={labelClass}>Banner</label>
                    {editingTour.banner?.url && (
                      <img
                        src={editingTour.banner.url}
                        alt="Banner"
                        className="mb-3 h-52 w-full rounded-xl object-cover border"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBanner(e.target.files[0])}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div>
                      <label className={labelClass}>Current Gallery</label>

                      <div className="grid grid-cols-3 gap-4 mt-3">
                        {editingTour.gallery?.map((image) => (
                          <div
                            key={image.fileId}
                            className="relative"
                          >
                            <img
                              src={image.url}
                              alt=""
                              className="h-28 w-full rounded-lg object-cover border"
                            />

                            <button
                              type="button"
                              onClick={() => removeGallery(image.fileId)}
                              className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <label className={labelClass}>Add New Gallery Images</label>

                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className={inputClass}
                          onChange={(e) => {
                            const newFiles = [...e.target.files];
                            setGallery((prev) => [
                              ...prev,
                              ...newFiles,
                            ]);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {gallery.map((file, index) => (
                          <div
                            key={index}
                            className="relative"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt=""
                              className="h-28 w-full rounded-lg object-cover border"
                            />

                            <button
                              type="button"
                              onClick={() => removeNewGalleryImage(index)}
                              className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 py-4 text-[12px] font-black uppercase tracking-widest text-white hover:bg-orange-500 transition"
              >
                <FaCheck size={14} />
                {submitted ? "Saved!" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Tours;
