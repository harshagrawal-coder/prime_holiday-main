import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { API_URI } from "../../config/config";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { toast } from "react-toastify";
const initialState = {
  name: "",
  overview: "",
  description: "",
  regionId: "",
  stateId: "",
  cityId: "",
  moodId: "",
  durationId: "",
  price: "",
  discountPrice: "",
  bestTimeToVisit: "",
  inclusions: [],
  exclusions: [],
  itinerary: [],
  trending: false,
  featured: false,
  isActive: true,
};
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600";
const AddTour = () => {
  const navigate = useNavigate()
  const [tour, setTour] = useState([])
  const [formData, setFormData] = useState(initialState);
  const [activeSection, setActiveSection] = useState("basic");
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [region, setRegions] = useState([])
  const [cities, setCity] = useState([])
  const [state, setState] = useState([])
  const [mood, setMood] = useState([])
  const [duration, setDuration] = useState([])
  const [gallery, setGallery] = useState([])
  const [banner, setBanner] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [newItineraryDay, setNewItineraryDay] = useState({ day: "", title: "", description: "", stay: "" });
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSubmitted(false);
    setUploadError("");
  };
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
      setRegions(data.regions);
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
      setState(data.states);
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
      setCity(data.cities)
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
      setMood(data.mood)
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
      setDuration(data.durations)
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
  }, [])
  console.log(state[0]?.regionId);
  console.log(cities[0]?.stateId);
  const handleRegionChange = (regionId) => {
    setFormData((current) => ({
      ...current,
      regionId,
      stateId: "",
      cityId: "",
    }));
  };
  const handleStateChange = (stateId) => {
    setFormData((current) => ({
      ...current,
      stateId,
      cityId: "",
    }));
  };

  const addInclusion = () => {
    if (!newInclusion.trim()) return;
    setFormData((current) => ({
      ...current,
      inclusions: [...current.inclusions, newInclusion.trim()],
    }));
    setNewInclusion("");
  };

  const removeInclusion = (index) => {
    setFormData((current) => ({
      ...current,
      inclusions: current.inclusions.filter((_, i) => i !== index),
    }));
  };

  const addExclusion = () => {
    if (!newExclusion.trim()) return;
    setFormData((current) => ({
      ...current,
      exclusions: [...current.exclusions, newExclusion.trim()],
    }));
    setNewExclusion("");
  };

  const removeExclusion = (index) => {
    setFormData((current) => ({
      ...current,
      exclusions: current.exclusions.filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    if (!newItineraryDay.day || !newItineraryDay.title || !newItineraryDay.description) return;
    setFormData((current) => ({
      ...current,
      itinerary: [...current.itinerary, { ...newItineraryDay, day: Number(newItineraryDay.day) }],
    }));
    setNewItineraryDay({ day: "", title: "", description: "", stay: "" });
  };

  const removeItineraryDay = (index) => {
    setFormData((current) => ({
      ...current,
      itinerary: current.itinerary.filter((_, i) => i !== index),
    }));
  };

  const filteredStates = state.filter((s) => s.regionId?._id === formData.regionId);
  const filteredCities = cities.filter((c) => c.stateId?._id === formData.stateId);
  const selectedState = state.find((s) => s._id === formData.stateId);
  const selectedDuration = duration.find((d) => d._id === formData.durationId);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadError("")
    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("overview", formData.overview)
      data.append("description", formData.description)
      data.append("regionId", formData.regionId)
      data.append("stateId", formData.stateId)
      data.append("cityId", formData.cityId)
      data.append("moodId", formData.moodId)
      data.append("durationId", formData.durationId)
      data.append("price", formData.price)
      data.append("discountPrice", formData.discountPrice)
      data.append("bestTimeToVisit", formData.bestTimeToVisit)
      data.append("inclusions", JSON.stringify(formData.inclusions))
      data.append("exclusions", JSON.stringify(formData.exclusions))
      data.append("itinerary", JSON.stringify(formData.itinerary))
      data.append("trending", formData.trending)
      data.append("featured", formData.featured)
      data.append("isActive", formData.isActive)
      data.append("thumbnail", thumbnail)
      data.append("banner", banner)
      gallery.forEach((image) => {
        data.append("gallery", image)
      })
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API_URI}/tour`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      })
      toast.success("Tour created successfully")
      navigate("/admin/tours");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);

      setUploadError(
        error.response?.data?.message || error.message
      );
    } finally {
      setIsSubmitting(false)
    }
  }
  const SectionToggle = ({ id, label, icon }) => (
    <button
      type="button"
      onClick={() => setActiveSection(activeSection === id ? "" : id)}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeSection === id
        ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
        }`}
    >
      <span className="flex items-center gap-2">{icon} {label}</span>
      {activeSection === id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
          Add Tour
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
          Create a New Tour
        </h2>
      </div>

      <div className="rounded-[1.75rem] bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="flex flex-wrap gap-2">
            <SectionToggle id="basic" label="Basic Details" icon={<span className="text-orange-500">01</span>} />
            <SectionToggle id="location" label="Location" icon={<span className="text-orange-500">02</span>} />
            <SectionToggle id="pricing" label="Pricing" icon={<span className="text-orange-500">03</span>} />
            <SectionToggle id="images" label="Images" icon={<span className="text-orange-500">04</span>} />
            <SectionToggle id="tourinfo" label="Tour Info" icon={<span className="text-orange-500">05</span>} />
            <SectionToggle id="flags" label="Flags" icon={<span className="text-orange-500">06</span>} />
          </div>

          {activeSection === "basic" && (
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Basic Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={labelClass}>Tour Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. Himalayan Adventure" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Overview *</label>
                  <textarea name="overview" value={formData.overview} onChange={handleChange} className={`${inputClass} resize-none min-h-20`} placeholder="Short overview of the tour (20-500 chars)" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} resize-none min-h-32`} placeholder="Detailed description of the tour (min 50 chars)" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Best Time to Visit *</label>
                  <input name="bestTimeToVisit" value={formData.bestTimeToVisit} onChange={handleChange} className={inputClass} placeholder="e.g. October to March" required />
                </div>
              </div>
            </div>
          )}

          {activeSection === "location" && (
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Location</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Region *</label>
                  <select name="regionId" value={formData.regionId} onChange={(e) => handleRegionChange(e.target.value)} className={inputClass} required>
                    <option value="">Select Region</option>
                    {region.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <select name="stateId" value={formData.stateId} onChange={(e) => handleStateChange(e.target.value)} className={inputClass} required disabled={!formData.regionId}>
                    <option value="">{formData.regionId ? "Select State" : "Select Region First"}</option>
                    {filteredStates.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <select name="cityId" value={formData.cityId} onChange={handleChange} className={inputClass} required disabled={!formData.stateId}>
                    <option value="">{formData.stateId ? "Select City" : "Select State First"}</option>
                    {filteredCities.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Mood / Category *</label>
                  <select name="moodId" value={formData.moodId} onChange={handleChange} className={inputClass} required>
                    <option value="">Select Mood</option>
                    {mood.map((m) => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Duration *</label>
                  <select name="durationId" value={formData.durationId} onChange={handleChange} className={inputClass} required>
                    <option value="">Select Duration</option>
                    {duration.map((d) => (
                      <option key={d._id} value={d._id}>{d.name} ({d.days}D/{d.nights}N)</option>
                    ))}
                  </select>
                  {selectedDuration ? (
                    <p className="mt-1.5 text-xs text-slate-500">
                      {selectedDuration.days} Days / {selectedDuration.nights} Nights
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {activeSection === "pricing" && (
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Pricing</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Base Price (₹) *</label>
                  <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} className={inputClass} placeholder="e.g. 15000" required />
                </div>
                <div>
                  <label className={labelClass}>Discount Price (₹)</label>
                  <input name="discountPrice" type="number" min="0" value={formData.discountPrice} onChange={handleChange} className={inputClass} placeholder="e.g. 12000 (optional)" />
                </div>
              </div>
            </div>
          )}

          {activeSection === "images" && (
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Images</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600 cursor-pointer hover:border-orange-300 transition">
                  <span className="font-semibold text-slate-800">Thumbnail *</span>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="text-sm"
                    onChange={(e) => setThumbnail(e.target.files[0])} />
                  <span className="text-xs text-slate-400">Main card image (JPG, PNG up to 5MB)</span>
                </label>
                <label className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600 cursor-pointer hover:border-orange-300 transition">
                  <span className="font-semibold text-slate-800">Banner *</span>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="text-sm"
                    onChange={(e) => setBanner(e.target.files[0])} />
                  <span className="text-xs text-slate-400">Hero banner image (JPG, PNG up to 5MB)</span>
                </label>
              </div>
              <label className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600 cursor-pointer hover:border-orange-300 transition">
                <span className="font-semibold text-slate-800">Gallery Images *(upto 5MB)</span>
                <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" className="text-sm"
                  onChange={(e) => setGallery([...e.target.files])} />
                <span className="text-xs text-slate-400">Upload up to 5 images for the gallery</span>
              </label>
              {uploadError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{uploadError}</div>
              ) : null}
            </div>
          )}

          {activeSection === "tourinfo" && (
            <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Tour Info</h3>

              <div>
                <label className={labelClass}>Inclusions</label>
                <div className="flex gap-2 mb-2">
                  <input value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)} className={inputClass} placeholder="e.g. Hotel accommodation" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())} />
                  <button type="button" onClick={addInclusion} className="shrink-0 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-600 transition">
                    <FaPlus size={12} />
                  </button>
                </div>
                {formData.inclusions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.inclusions.map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                        {item}
                        <button type="button" onClick={() => removeInclusion(i)} className="text-emerald-500 hover:text-red-500 transition"><FaTimes size={10} /></button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No inclusions added yet.</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Exclusions</label>
                <div className="flex gap-2 mb-2">
                  <input value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)} className={inputClass} placeholder="e.g. Flight tickets" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())} />
                  <button type="button" onClick={addExclusion} className="shrink-0 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-600 transition">
                    <FaPlus size={12} />
                  </button>
                </div>
                {formData.exclusions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.exclusions.map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                        {item}
                        <button type="button" onClick={() => removeExclusion(i)} className="text-red-400 hover:text-red-600 transition"><FaTimes size={10} /></button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No exclusions added yet.</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Itinerary</label>
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 mb-3">
                  <div className="grid gap-3 md:grid-cols-4">
                    <input type="number" min="1" value={newItineraryDay.day} onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, day: e.target.value }))} className={inputClass} placeholder="Day" />
                    <input value={newItineraryDay.title} onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, title: e.target.value }))} className={inputClass} placeholder="Title" />
                    <input value={newItineraryDay.stay} onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, stay: e.target.value }))} className={inputClass} placeholder="Stay (optional)" />
                  </div>
                  <textarea value={newItineraryDay.description} onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, description: e.target.value }))} className={`${inputClass} resize-none min-h-16`} placeholder="Day description" />
                  <button type="button" onClick={addItineraryDay} className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition">Add Day</button>
                </div>
                {formData.itinerary.length > 0 ? (
                  <div className="space-y-2">
                    {formData.itinerary.map((day, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-600">D{day.day}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{day.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{day.description}</p>
                          {day.stay ? <p className="text-xs text-slate-400 mt-0.5">Stay: {day.stay}</p> : null}
                        </div>
                        <button type="button" onClick={() => removeItineraryDay(i)} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"><FaTrash size={12} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No itinerary days added yet.</p>
                )}
              </div>
            </div>
          )}

          {activeSection === "flags" && (
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Tour Flags</h3>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="trending" checked={formData.trending} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">Trending</span>
                    <p className="text-xs text-slate-500">Mark this tour as trending</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">Featured</span>
                    <p className="text-xs text-slate-500">Show this tour in featured section</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">Active</span>
                    <p className="text-xs text-slate-500">Tour is visible on the website</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {uploadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{uploadError}</div>
          ) : null}

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-sm text-slate-500">Tour will be saved locally.</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-slate-950 px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Tour"}
            </button>
          </div>
        </form>

        {submitted ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Tour saved successfully.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AddTour;
