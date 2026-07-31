import { useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const CheckboxGroup = ({ label, icon: Icon, options, selected, onChange, single }) => {
  const [isOpen, setIsOpen] = useState(false);
  const count = single
    ? (selected && selected !== "All Vibes" && selected !== "All Regions" ? 1 : 0)
    : selected.length;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <span className="text-slate-400"><Icon size={13} /></span>}
          <span className="text-[12px] font-bold uppercase tracking-wide text-slate-700">{label}</span>
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[9px] font-black text-white">
              {count}
            </span>
          )}
        </div>
        <FaChevronDown
          size={11}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 border-t border-slate-100 px-2 py-2">
              {options.length === 0 ? (
                <p className="px-3 py-4 text-center text-[11px] text-slate-400">No options available</p>
              ) : (
                options.map((option) => {
                  const val = option.name || option;
                  const checked = single ? selected === val : selected.includes(val);
                  return (
                    <label
                      key={option._id || val}
                      onClick={() => onChange(val)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                        checked
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-slate-300 bg-white"
                      }`}>
                        {checked && <FaCheck size={10} />}
                      </span>
                      <span className="text-[13px]">{val}</span>
                    </label>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckboxGroup;
