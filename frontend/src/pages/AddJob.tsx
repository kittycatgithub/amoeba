// AddJob.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { INDIAN_STATES, STATE_CITIES } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import JoditEditor from "jodit-react";
import { useAppDispatch } from "../store/hooks";
import { createJob } from "../store/slices/jobSlice";

// Types
interface JobFormData {
  title: string;
  description: string;
  skills: string[];
  status: "open" | "closed";
  location: "remote" | "hybrid" | "on-site";
  workLocation: { city: string; state: string }; // was `{ city: '', state: '' },` — invalid
  salaryRange: {
    min: number | null;
    max: number | null;
  };
  ctc: number | null;
  jobTypes: string[];
}

interface JobTypeOption {
  value: string;
  label: string;
}

const AddJob: React.FC = () => {
  const navigate = useNavigate();
  const { user, setShowUserLogin } = useAppContext();
  const dispatch = useAppDispatch();

  // Form state
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    skills: [""],
    status: "open",
    location: "remote",
    workLocation: { city: "", state: "" },
    salaryRange: {
      min: null,
      max: null,
    },
    ctc: null,
    jobTypes: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const jobTypeRef = useRef<HTMLDivElement>(null);

  // Close the job type dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        jobTypeRef.current &&
        !jobTypeRef.current.contains(e.target as Node)
      ) {
        setIsJobTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Job types options
  const jobTypeOptions: JobTypeOption[] = [
    { value: "contractual", label: "Contractual / Temporary" },
    { value: "freelance", label: "Freelance" },
    { value: "part-time", label: "Part-time" },
    { value: "full-time", label: "Full-time" },
    { value: "internship", label: "Internship" },
    { value: "volunteer", label: "Volunteer" },
  ];

  // Jodit config — memoized so the editor doesn't re-init on every render
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 300,
      placeholder:
        "Describe the job responsibilities, requirements, and benefits...",
      buttons: [
        "bold",
        "italic",
        "underline",
        "ul",
        "ol",
        "|",
        "link",
        "|",
        "undo",
        "redo",
      ],
      toolbarAdaptive: false,
    }),
    [],
  );

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle salary range changes
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? null : Number(value);
    setFormData((prev) => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [name]: numValue,
      },
    }));
  };

  // Handle CTC change
  const handleCTCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setFormData((prev) => ({
      ...prev,
      ctc: value,
    }));
  };

  // Skills management
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const addSkillRow = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const removeSkillRow = (index: number) => {
    if (formData.skills.length > 1) {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        skills: newSkills,
      }));
    }
  };

  // Description change handler for Jodit
  const handleDescriptionChange = (newContent: string) => {
    setFormData((prev) => ({
      ...prev,
      description: newContent,
    }));
  };

  // Job type multiselect handling
  const handleJobTypeToggle = (value: string) => {
    setFormData((prev) => {
      const currentTypes = prev.jobTypes;
      const newTypes = currentTypes.includes(value)
        ? currentTypes.filter((type) => type !== value)
        : [...currentTypes, value];
      return {
        ...prev,
        jobTypes: newTypes,
      };
    });
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      workLocation: { state: value, city: "" },
    }));
  };

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      workLocation: { ...prev.workLocation, city: value },
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowUserLogin(true);
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (formData.jobTypes.length === 0) {
      toast.error("Select at least one job type");
      return;
    }
    const cleanSkills = formData.skills.map((s) => s.trim()).filter(Boolean);
    if (cleanSkills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        skills: cleanSkills,
      };
      await dispatch(createJob(payload)).unwrap();
      toast.success("Job posted successfully!");
      navigate("/my-jobs");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Style helpers (Tailwind, mirroring AddProperty.tsx conventions) ───────
  const inputCls =
    "w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm transition focus:border-primary bg-white";

  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative w-full h-[20vh] md:h-[30vh] min-h-[20vh]">
        <img
          src="/images/panoramic.jpg"
          alt="Background Image"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Post Job
          </motion.h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Post a <span className="text-primary-dull">Job</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to list your job opening
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* ── Title ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <div>
              <label htmlFor="title" className={labelCls}>
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={inputCls}
                placeholder="e.g., Senior Real Estate Agent"
              />
            </div>
          </div>

          {/* ── Description (Jodit) ── */}
          <div className="job-description-content  bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <label className={labelCls}>Job Description *</label>
            <JoditEditor
              value={formData.description}
              config={editorConfig}
              onBlur={handleDescriptionChange}
            />
          </div>

          {/* ── Skills ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Skills Required
            </h2>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className={inputCls}
                  placeholder={`Skill ${index + 1}`}
                  required
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkillRow(index)}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSkillRow}
              className="text-sm text-primary hover:text-primary-dull font-medium cursor-pointer"
            >
              + Add Another Skill
            </button>
          </div>

          {/* ── Job Status & Location ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className={labelCls}>
                  Job Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={inputCls}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label htmlFor="location" className={labelCls}>
                  Job Location *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={inputCls}
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── City / State ── */}
          {/* ── City / State ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className={labelCls}>
                  State
                </label>
                <select
                  id="state"
                  value={formData.workLocation.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select state...</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className={labelCls}>
                  City
                </label>
                <select
                  id="city"
                  value={formData.workLocation.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={inputCls}
                  disabled={!formData.workLocation.state}
                >
                  <option value="">
                    {formData.workLocation.state
                      ? "Select city..."
                      : "Select state first"}
                  </option>
                  {(STATE_CITIES[formData.workLocation.state] || []).map(
                    (city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* ── Salary & CTC ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <div className="mb-4">
              <label className={labelCls}>Salary Range (Optional)</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="min" className="block text-xs text-gray-500">
                    Minimum
                  </label>
                  <input
                    type="number"
                    id="min"
                    name="min"
                    value={formData.salaryRange.min ?? ""}
                    onChange={handleSalaryChange}
                    className={inputCls}
                    placeholder="e.g., 50000"
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="max" className="block text-xs text-gray-500">
                    Maximum
                  </label>
                  <input
                    type="number"
                    id="max"
                    name="max"
                    value={formData.salaryRange.max ?? ""}
                    onChange={handleSalaryChange}
                    className={inputCls}
                    placeholder="e.g., 100000"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="ctc" className={labelCls}>
                CTC (Optional)
              </label>
              <input
                type="number"
                id="ctc"
                name="ctc"
                value={formData.ctc ?? ""}
                onChange={handleCTCChange}
                className={inputCls}
                placeholder="e.g., 1500000"
                min="0"
                step="10000"
              />
              <p className="text-xs text-gray-400 mt-1">
                Total Cost to Company (annual)
              </p>
            </div>
          </div>

          {/* ── Job Type ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <label className={labelCls}>Job Type *</label>
            <div className="relative" ref={jobTypeRef}>
              <div
                onClick={() => setIsJobTypeOpen((prev) => !prev)}
                className="border border-gray-300 rounded-lg p-2 min-h-[46px] cursor-pointer focus-within:border-primary"
              >
                <div className="flex flex-wrap gap-1">
                  {formData.jobTypes.length === 0 ? (
                    <span className="text-gray-400 text-sm">
                      Select job types...
                    </span>
                  ) : (
                    formData.jobTypes.map((type) => {
                      const option = jobTypeOptions.find(
                        (opt) => opt.value === type,
                      );
                      return option ? (
                        <span
                          key={type}
                          className="inline-flex items-center bg-primary text-white text-sm px-2 py-1 rounded"
                        >
                          {option.label}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJobTypeToggle(type);
                            }}
                            className="ml-1 hover:text-gray-200 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })
                  )}
                </div>
              </div>

              {/* Dropdown options — only rendered when open */}
              {isJobTypeOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {jobTypeOptions.map((option) => {
                    const selected = formData.jobTypes.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        onClick={() => handleJobTypeToggle(option.value)}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                          selected
                            ? "bg-primary text-white hover:bg-primary-dull"
                            : ""
                        }`}
                      >
                        {option.label}
                        {selected && " ✓"}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Select all that apply</p>
          </div>

          {/* ── Submit ── */}
          <div className="flex justify-end pb-10">
            <button
              type="submit"
              disabled={submitting}
              className="px-10 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dull transition disabled:opacity-60 cursor-pointer text-base"
            >
              {submitting ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
