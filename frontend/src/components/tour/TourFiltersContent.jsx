import { FaChevronDown, FaClock, FaMapMarkerAlt, FaMountain } from "react-icons/fa";
import TourDropdownField from "./TourDropdownField";

const TourFiltersContent = ({
  durations,
  city,
  regions,
  moods,
  states,
  selectedRegion,
  setSelectedRegion,
  selectedStates,
  setSelectedStates,
  selectedCities,
  setSelectedCities,
  selectedDays,
  setSelectedDays,
  selectedVibe,
  setSelectedVibe,
  priceRange,
  setPriceRange,
  openDropdown,
  setOpenDropdown,
}) => (
  <>
    <TourDropdownField
      label="01. Region"
      id="region"
      icon={<FaChevronDown />}
      value={selectedRegion || "All Regions"}
      options={regions}
      onSelect={(region) => {
        setSelectedRegion(region === "All Regions" ? "" : region);
        setSelectedStates([]);
        setSelectedCities([]);
      }}
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
    />

    <TourDropdownField
      label="02. State"
      id="state"
      icon={<FaChevronDown />}
      value={selectedStates}
      options={states}
      onSelect={(state) =>
        setSelectedStates((prev) =>
          prev.includes(state) ? prev.filter((item) => item !== state) : [...prev, state]
        )
      }
      multi={true}
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
    />

    <TourDropdownField
      label="03. City"
      id="city"
      icon={<FaMapMarkerAlt />}
      value={selectedCities}
      options={city}
      onSelect={(city) =>
        setSelectedCities((prev) =>
          prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]
        )
      }
      multi={true}
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
    />

    <TourDropdownField
      label="04. Duration"
      id="days"
      icon={<FaClock />}
      value={selectedDays}
      options={durations}
      onSelect={(day) =>
        setSelectedDays((prev) =>
          prev.includes(day)
            ? prev.filter((item) => item !== day)
            : [...prev, day]
        )
      }
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
    />

    <TourDropdownField
      label="05. Experience"
      id="mood"
      icon={<FaMountain />}
      value={selectedVibe}
      options={moods}
      onSelect={(mood) => setSelectedVibe(mood)}
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
    />

    <div className="space-y-4 pt-2">
      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-800">
        <span>Max Budget</span>
        <span className="font-bold text-orange-600">₹{priceRange.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min="5000"
        max="200000"
        step="5000"
        value={priceRange}
        onChange={(event) => setPriceRange(parseInt(event.target.value, 10))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-orange-600"
      />
    </div>
  </>
);

export default TourFiltersContent;
