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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTour } from "../../redux/slices/tourSlice";
import { fetchRegions } from "../../redux/slices/regionSlice";
import { fetchStates } from "../../redux/slices/stateSlice";
import { fetchCities } from "../../redux/slices/citySlice";
import { fetchMoods } from "../../redux/slices/moodSlice";
import { fetchDurations } from "../../redux/slices/durationSlice";

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

const AddTour = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const region = useSelector((s) => s.region.items);
  const state = useSelector((s) => s.state.items);
  const cities = useSelector((s) => s.city.items);
  const mood = useSelector((s) => s.mood.items);
  const duration = useSelector((s) => s.duration.items);
  const [formData, setFormData] = useState(initialState);
  const [activeSection, setActiveSection] = useState("basic");
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [gallery, setGallery] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [newItineraryDay, setNewItineraryDay] = useState({
    day: "",
    title: "",
    description: "",
    stay: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSubmitted(false);
    setUploadError("");
  };

  useEffect(() => {
    dispatch(fetchRegions({ isActive: true }));
    dispatch(fetchStates({ isActive: true }));
    dispatch(fetchCities({ isActive: true }));
    dispatch(fetchDurations({ isActive: true }));
    dispatch(fetchMoods({ isActive: true }));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(file ? URL.createObjectURL(file) : null);
    setUploadError("");
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
  };

  const handleBanner = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
    setUploadError("");
  };

  const removeBanner = () => {
    setBanner(null);
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(null);
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setGallery(files);
    galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    setUploadError("");
  };

  const removeGalleryImage = (index) => {
    setGallery((current) => current.filter((_, i) => i !== index));
    setGalleryPreviews((current) => {
      const next = current.filter((_, i) => i !== index);
      return next;
    });
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
    if (!newItineraryDay.day || !newItineraryDay.title || !newItineraryDay.description)
      return;
    setFormData((current) => ({
      ...current,
      itinerary: [
        ...current.itinerary,
        { ...newItineraryDay, day: Number(newItineraryDay.day) },
      ],
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
  const selectedDuration = duration.find((d) => d._id === formData.durationId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError("");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("overview", formData.overview);
      data.append("description", formData.description);
      data.append("regionId", formData.regionId);
      data.append("stateId", formData.stateId);
      data.append("cityId", formData.cityId);
      data.append("moodId", formData.moodId);
      data.append("durationId", formData.durationId);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice);
      data.append("bestTimeToVisit", formData.bestTimeToVisit);
      data.append("inclusions", JSON.stringify(formData.inclusions));
      data.append("exclusions", JSON.stringify(formData.exclusions));
      data.append("itinerary", JSON.stringify(formData.itinerary));
      data.append("trending", formData.trending);
      data.append("featured", formData.featured);
      data.append("isActive", formData.isActive);
      data.append("thumbnail", thumbnail);
      data.append("banner", banner);
      gallery.forEach((image) => {
        data.append("gallery", image);
      });
      const result = await dispatch(createTour(data));
      if (result.error) {
        throw new Error(result.payload || "Failed to create tour");
      }
      toast.success("Tour created successfully");
      navigate("/admin/tours");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);

      setUploadError(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                <FileText size={15} className="text-[#FF6B00]" />
                Basic Details
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Core information that identifies and introduces the tour.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Tour Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Himalayan Adventure"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Overview *</label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  className={`${inputClass} min-h-20 resize-none`}
                  placeholder="Short overview of the tour (20-500 chars)"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`${inputClass} min-h-32 resize-none`}
                  placeholder="Detailed description of the tour (min 50 chars)"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Best Time to Visit *</label>
                <input
                  name="bestTimeToVisit"
                  value={formData.bestTimeToVisit}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. October to March"
                  required
                />
              </div>
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                <MapPin size={15} className="text-[#FF6B00]" />
                Location
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Where the tour starts and the region it covers.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className={labelClass}>Region *</label>
                <select
                  name="regionId"
                  value={formData.regionId}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select Region</option>
                  {region.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <select
                  name="stateId"
                  value={formData.stateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={inputClass}
                  required
                  disabled={!formData.regionId}
                >
                  <option value="">
                    {formData.regionId ? "Select State" : "Select Region First"}
                  </option>
                  {filteredStates.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  disabled={!formData.stateId}
                >
                  <option value="">
                    {formData.stateId ? "Select City" : "Select State First"}
                  </option>
                  {filteredCities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Mood / Category *</label>
                <select
                  name="moodId"
                  value={formData.moodId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Mood</option>
                  {mood.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Duration *</label>
                <select
                  name="durationId"
                  value={formData.durationId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Duration</option>
                  {duration.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.days}D/{d.nights}N)
                    </option>
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
        );

      case "pricing":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                <Tag size={15} className="text-[#FF6B00]" />
                Pricing
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Set the base price and optional discounted offer price.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 15000"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Offer Price (₹)</label>
                <input
                  name="discountPrice"
                  type="number"
                  min="0"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 12000 (optional)"
                />
              </div>
            </div>
          </div>
        );

      case "images":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                <ImageIcon size={15} className="text-[#FF6B00]" />
                Images
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Upload the main card image, hero banner and up to 5 gallery images.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#FF6B00]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00]/10">
                  <Upload size={20} className="text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Thumbnail *
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Main card image (JPG, PNG up to 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleThumbnail}
                />
              </label>

              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#FF6B00]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00]/10">
                  <Upload size={20} className="text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Banner *</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Hero banner image (JPG, PNG up to 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleBanner}
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {thumbnailPreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-44 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A]/70 text-white transition hover:bg-red-500"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-2 left-2 rounded-md bg-[#0F172A]/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Thumbnail
                  </span>
                </div>
              ) : null}

              {bannerPreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="h-44 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A]/70 text-white transition hover:bg-red-500"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-2 left-2 rounded-md bg-[#0F172A]/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Banner
                  </span>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#FF6B00]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00]/10">
                  <Upload size={20} className="text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Gallery Images * (upto 5MB)
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Upload up to 5 images for the gallery
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleGallery}
                />
              </label>

              {galleryPreviews.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {galleryPreviews.map((preview, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src={preview}
                        alt={`Gallery ${i + 1}`}
                        className="h-24 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F172A]/70 text-white transition hover:bg-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        );

      case "tourinfo":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                <Info size={15} className="text-[#FF6B00]" />
                Tour Info
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Inclusions, exclusions and the day-by-day itinerary.
              </p>
            </div>

            <div>
              <label className={labelClass}>Inclusions</label>
              <div className="mb-2 flex gap-2">
                <input
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Hotel accommodation"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addInclusion())
                  }
                />
                <button
                  type="button"
                  onClick={addInclusion}
                  className="shrink-0 rounded-xl bg-[#FF6B00] px-4 text-white transition hover:bg-[#e65f00]"
                >
                  <Plus size={16} />
                </button>
              </div>
              {formData.inclusions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.inclusions.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                    >
                      <CheckCircle2 size={12} />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeInclusion(i)}
                        className="text-emerald-500 transition hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No inclusions added yet.</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Exclusions</label>
              <div className="mb-2 flex gap-2">
                <input
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Flight tickets"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addExclusion())
                  }
                />
                <button
                  type="button"
                  onClick={addExclusion}
                  className="shrink-0 rounded-xl bg-[#FF6B00] px-4 text-white transition hover:bg-[#e65f00]"
                >
                  <Plus size={16} />
                </button>
              </div>
              {formData.exclusions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.exclusions.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                    >
                      <Ban size={12} />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeExclusion(i)}
                        className="text-red-400 transition hover:text-red-600"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No exclusions added yet.</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Itinerary</label>
              <div className="mb-3 space-y-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    type="number"
                    min="1"
                    value={newItineraryDay.day}
                    onChange={(e) =>
                      setNewItineraryDay((prev) => ({ ...prev, day: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="Day"
                  />
                  <input
                    value={newItineraryDay.title}
                    onChange={(e) =>
                      setNewItineraryDay((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="Title"
                  />
                  <input
                    value={newItineraryDay.stay}
                    onChange={(e) =>
                      setNewItineraryDay((prev) => ({ ...prev, stay: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="Stay (optional)"
                  />
                </div>
                <textarea
                  value={newItineraryDay.description}
                  onChange={(e) =>
                    setNewItineraryDay((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={`${inputClass} min-h-16 resize-none`}
                  placeholder="Day description"
                />
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#e65f00]"
                >
                  <Plus size={14} />
                  Add Day
                </button>
              </div>
              {formData.itinerary.length > 0 ? (
                <div className="space-y-2">
                  {formData.itinerary.map((day, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6B00]/10 text-xs font-bold text-[#FF6B00]">
                        <Clock size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          Day {day.day} — {day.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {day.description}
                        </p>
                        {day.stay ? (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Stay: {day.stay}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(i)}
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No itinerary days added yet.
                </p>
              )}
            </div>
          </div>
        );

      case "flags":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700">
                <Flag size={15} className="text-[#FF6B00]" />
                Tour Flags
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Control how this tour is promoted and shown on the website.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Toggle
                title="Trending"
                description="Mark this tour as trending"
                checked={formData.trending}
                onChange={(checked) =>
                  setFormData((current) => ({ ...current, trending: checked }))
                }
              />
              <Toggle
                title="Featured"
                description="Show this tour in featured section"
                checked={formData.featured}
                onChange={(checked) =>
                  setFormData((current) => ({ ...current, featured: checked }))
                }
              />
              <Toggle
                title="Active"
                description="Tour is visible on the website"
                checked={formData.isActive}
                onChange={(checked) =>
                  setFormData((current) => ({ ...current, isActive: checked }))
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FF6B00]">
          Add Tour
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0F172A]">
          Create a New Tour
        </h2>
      </div>

      <div className="rounded-2xl bg-white shadow-md">
        <div className="border-b border-slate-200 p-5">
          <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {sections.map(({ id, num, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
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
                  <Icon size={14} className={isActive ? "text-white/90" : "text-slate-400"} />
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>

            {uploadError ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {uploadError}
              </div>
            ) : null}

            {submitted ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                Tour saved successfully.
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-200 p-5 sm:flex-row sm:p-7">
            <p className="text-sm text-slate-500">Tour will be saved locally.</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={15} />
              {isSubmitting ? "Saving..." : "Save Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTour;
