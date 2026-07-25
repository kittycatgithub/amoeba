import React, { useState, useEffect, useMemo } from "react";
import { INDIAN_STATES, STATE_CITIES } from "../assets/assets";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import JoditEditor from "jodit-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCurrentJob, fetchJobById, updateJob } from "../store/slices/jobSlice";

interface JobTypeOption {
  value: string;
  label: string;
}

interface FormState {
  title: string;
  description: string;
  skills: string[];
  status: "open" | "closed";
  location: "remote" | "hybrid" | "on-site";
  workLocation: { city: string; state: string };
  salaryRange: { min: number | null; max: number | null };
  ctc: number | null;
  jobTypes: string[];
}

const initialForm: FormState = {
  title: "",
  description: "",
  skills: [""],
  status: "open",
  location: "remote",
  workLocation: { city: "", state: "" },
  salaryRange: { min: null, max: null },
  ctc: null,
  jobTypes: [],
};

const jobTypeOptions: JobTypeOption[] = [
  { value: "contractual", label: "Contractual / Temporary" },
  { value: "freelance", label: "Freelance" },
  { value: "part-time", label: "Part-time" },
  { value: "full-time", label: "Full-time" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteer" },
];

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const { user, setShowUserLogin } = useAppContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentJob = useAppSelector((state) => state.job.currentJob);

  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const jobTypeRef = React.useRef<HTMLDivElement>(null);

  // Close job type dropdown on outside click
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

  useEffect(() => {
    if (!id) return;
    dispatch(fetchJobById(id));
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [id, dispatch]);

  // separate effect: once currentJob arrives, hydrate the form
  useEffect(() => {
    if (!currentJob) return;
    setForm({
      title: currentJob.title || "",
      description: currentJob.description || "",
      skills: currentJob.skills?.length > 0 ? currentJob.skills : [""],
      status: currentJob.status || "open",
      location: currentJob.location || "remote",
      workLocation: {
        city: currentJob.workLocation?.city || "",
        state: currentJob.workLocation?.state || "",
      },
      salaryRange: {
        min: currentJob.salaryRange?.min ?? null,
        max: currentJob.salaryRange?.max ?? null,
      },
      ctc: currentJob.ctc ?? null,
      jobTypes: currentJob.jobTypes || [],
    });
    setLoading(false);
  }, [currentJob]);

  // Jodit config — memoized so the editor doesn't re-init on every render
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 300,
      placeholder: "Write the job description...",
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

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSalaryChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? null : Number(value);
    setForm((prev) => ({
      ...prev,
      salaryRange: { ...prev.salaryRange, [field]: numValue },
    }));
  };

  const handleStateChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      workLocation: { state: value, city: "" },
    }));
  };

  const handleCityChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      workLocation: { ...prev.workLocation, city: value },
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...form.skills];
    newSkills[index] = value;
    set("skills", newSkills);
  };

  const addSkillRow = () => set("skills", [...form.skills, ""]);

  const removeSkillRow = (index: number) => {
    if (form.skills.length > 1) {
      set(
        "skills",
        form.skills.filter((_, i) => i !== index),
      );
    }
  };

  const handleJobTypeToggle = (value: string) => {
    setForm((prev) => {
      const newTypes = prev.jobTypes.includes(value)
        ? prev.jobTypes.filter((t) => t !== value)
        : [...prev.jobTypes, value];
      return { ...prev, jobTypes: newTypes };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (form.jobTypes.length === 0) {
      toast.error("Select at least one job type");
      return;
    }
    const cleanSkills = form.skills.map((s) => s.trim()).filter(Boolean);
    if (cleanSkills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, skills: cleanSkills };
      await dispatch(updateJob({ id: id!, payload })).unwrap();
      toast.success("Job updated successfully!");
      navigate("/my-jobs");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Login to Edit Job
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to edit your job posting.
          </p>
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dull transition"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-gray-500 text-lg">Loading job...</p>
      </div>
    );
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm transition focus:border-primary bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative w-full h-[20vh] md:h-[30vh] min-h-[20vh]">
        <img
          src="/pageImg.jpg"
          alt="Background"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -110 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Edit Job
          </motion.h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Your <span className="text-primary-dull">Job Posting</span>
          </h1>
          <p className="text-gray-500 mt-1">Update the details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* ── Title ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <label htmlFor="title" className={labelCls}>
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className={inputCls}
              placeholder="e.g., Senior Real Estate Agent"
            />
          </div>

          {/* ── Description (Jodit) ── */}
          <div className="job-description-content bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <label className={labelCls}>Job Description *</label>
            <JoditEditor
              value={form.description}
              config={editorConfig}
              onBlur={(newContent) => set("description", newContent)}
            />
          </div>

          {/* ── Skills ── */}
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Skills Required
            </h2>
            {form.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className={inputCls}
                  placeholder={`Skill ${index + 1}`}
                  required
                />
                {form.skills.length > 1 && (
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
                  value={form.status}
                  onChange={(e) =>
                    set("status", e.target.value as FormState["status"])
                  }
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
                  value={form.location}
                  onChange={(e) =>
                    set("location", e.target.value as FormState["location"])
                  }
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
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className={labelCls}>
                  State
                </label>
                <select
                  id="state"
                  value={form.workLocation.state}
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
                  value={form.workLocation.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={inputCls}
                  disabled={!form.workLocation.state}
                >
                  <option value="">
                    {form.workLocation.state
                      ? "Select city..."
                      : "Select state first"}
                  </option>
                  {(STATE_CITIES[form.workLocation.state] || []).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
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
                  <label className="block text-xs text-gray-500">Minimum</label>
                  <input
                    type="number"
                    value={form.salaryRange.min ?? ""}
                    onChange={(e) => handleSalaryChange("min", e.target.value)}
                    className={inputCls}
                    placeholder="e.g., 50000"
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500">Maximum</label>
                  <input
                    type="number"
                    value={form.salaryRange.max ?? ""}
                    onChange={(e) => handleSalaryChange("max", e.target.value)}
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
                value={form.ctc ?? ""}
                onChange={(e) =>
                  set(
                    "ctc",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
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
                  {form.jobTypes.length === 0 ? (
                    <span className="text-gray-400 text-sm">
                      Select job types...
                    </span>
                  ) : (
                    form.jobTypes.map((type) => {
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

              {isJobTypeOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {jobTypeOptions.map((option) => {
                    const selected = form.jobTypes.includes(option.value);
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
          <div className="flex justify-end pb-10 gap-4">
            <button
              type="button"
              onClick={() => navigate("/my-jobs")}
              className="px-4 py-1.5 md:px-8 md:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition cursor-pointer text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 md:px-10 md:py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dull transition disabled:opacity-60 cursor-pointer text-base"
            >
              {submitting ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
