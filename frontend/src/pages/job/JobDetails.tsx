// JobDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import {
  clearCurrentJob,
  fetchJobById,
  fetchJobs,
} from "../../store/slices/jobSlice";

// ─── Types ──────────────────────────────────────────────────────────────
interface Job {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  status: "open" | "closed";
  location: "remote" | "hybrid" | "on-site";
  workLocation: { city: string; state: string };
  salaryRange: { min: number | null; max: number | null };
  ctc: number | null;
  jobTypes: string[];
  createdAt: string;
  postedBy?: { name: string; _id: string };
}

const JOB_TYPE_LABELS: Record<string, string> = {
  contractual: "Contractual / Temporary",
  freelance: "Freelance",
  "part-time": "Part-time",
  "full-time": "Full-time",
  internship: "Internship",
  volunteer: "Volunteer",
};

// ─── Helpers ────────────────────────────────────────────────────────────
const formatCurrency = (value: number | null): string => {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const timeAgo = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

// ─── Skeleton ───────────────────────────────────────────────────────────
const JobDetailsSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto py-8 px-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const JobDetails: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  console.log(jobId, "jobId");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    currentJob: job,
    jobLoading: loading,
    error,
  } = useAppSelector((state: RootState) => state.job);

  const { user, setShowUserLogin } = useAppContext();

  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Fetch job details
  useEffect(() => {
    if (!jobId) return;
    dispatch(fetchJobById(jobId));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [jobId, dispatch]);

  // Fetch similar jobs once the main job is loaded
  useEffect(() => {
    if (!job) return;
    const fetchSimilar = async () => {
      setSimilarLoading(true);
      try {
        const result = await dispatch(
          fetchJobs({ skills: job.skills.join(","), limit: 7 }),
        ).unwrap();
        setSimilarJobs(
          (result.jobs || []).filter((j: Job) => j._id !== job._id).slice(0, 6),
        );
      } catch {
        setSimilarJobs([]);
      } finally {
        setSimilarLoading(false);
      }
    };
    fetchSimilar();
  }, [job, dispatch]);

  const handleApply = () => {
    if (!user) {
      setShowUserLogin(true);
      return;
    }
    setApplying(true);
    // Placeholder for actual apply API call
    setTimeout(() => {
      toast.success("Application submitted!");
      setApplying(false);
    }, 800);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: job?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // user cancelled share — no-op
    }
  };

  const cardCls =
    "bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100";

  if (loading) return <JobDetailsSkeleton />;

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {error || "Job not found"}
        </h2>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dull transition cursor-pointer"
        >
          Browse other jobs
        </button>
      </div>
    );
  }

  const locationLabel =
    job.workLocation?.city && job.workLocation?.state
      ? `${job.workLocation.city}, ${job.workLocation.state}`
      : job.location.replace("-", " ");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 md:py-10 px-4">
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/job-search" className="hover:text-primary">
            Jobs
          </Link>
          <span>/</span>
          <span className="text-gray-700 line-clamp-1">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Title / meta card */}
            <div className={cardCls}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      📍 {locationLabel}
                    </span>
                    <span className="capitalize flex items-center gap-1">
                      🏢 {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      🕒 Posted {timeAgo(job.createdAt)}
                    </span>
                  </div>
                </div>
                <span
                  className={`self-start px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    job.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {job.status === "open" ? "Actively Hiring" : "Closed"}
                </span>
              </div>

              {/* Job type chips */}
              {job.jobTypes?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.jobTypes.map((type) => (
                    <span
                      key={type}
                      className="text-xs sm:text-sm bg-primary/10 text-primary-dull px-3 py-1 rounded-full font-medium"
                    >
                      {JOB_TYPE_LABELS[type] || type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className={cardCls}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Job Description
              </h2>
              <div
                className="prose prose-sm sm:prose-base max-w-none text-gray-700 break-words"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              {/* Skills */}
              {job.skills?.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4 md:space-y-6">
            <div className={`${cardCls} lg:sticky lg:top-6`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Compensation
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Salary Range</span>
                  <span className="font-medium text-gray-800 text-right">
                    {job.salaryRange?.min || job.salaryRange?.max
                      ? `${formatCurrency(job.salaryRange.min)} – ${formatCurrency(
                          job.salaryRange.max,
                        )}`
                      : "Not disclosed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CTC</span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(job.ctc)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted On</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-6">
                <button
                  onClick={handleApply}
                  disabled={applying || job.status !== "open"}
                  className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dull transition disabled:opacity-60 cursor-pointer text-sm md:text-base"
                >
                  {job.status !== "open"
                    ? "Applications Closed"
                    : applying
                      ? "Applying..."
                      : "Apply Now"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition cursor-pointer text-sm md:text-base"
                >
                  Share Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Similar Jobs ── */}
        <div className="mt-10 md:mt-14">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
            Similar <span className="text-primary-dull">Jobs</span>
          </h2>

          {similarLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : similarJobs.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No similar jobs found right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarJobs.map((sj) => {
                const sjLocation =
                  sj.workLocation?.city && sj.workLocation?.state
                    ? `${sj.workLocation.city}, ${sj.workLocation.state}`
                    : sj.location.replace("-", " ");
                return (
                  <motion.div
                    key={sj._id}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
                    onClick={() => navigate(`/job-details/${sj._id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
                        {sj.title}
                      </h3>
                      <span
                        className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          sj.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {sj.status === "open" ? "Open" : "Closed"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center gap-1">
                      📍 {sjLocation}
                    </p>
                    {sj.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {sj.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {sj.skills.length > 3 && (
                          <span className="text-[10px] sm:text-xs text-gray-400 px-1 py-1">
                            +{sj.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
                      <span>{timeAgo(sj.createdAt)}</span>
                      <span className="text-primary font-medium">View →</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
