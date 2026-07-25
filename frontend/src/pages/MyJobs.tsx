import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteJob, fetchMyJobs } from "../store/slices/jobSlice";

const currency = "₹";

// ─── Edit Button ──────────────────────────────────────────────────────────────

const EditJobButton = ({ jobId }: { jobId: string }) => (
  <div>
    <Link
      to={`/edit-job/${jobId}`}
      onClick={()=> scrollTo(0,0)}
      className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary hover:text-white inline-block"
    >
      <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
      <span className="relative z-10 group-hover:text-white">Edit Job</span>
    </Link>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const MyJobs = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.job.myJobs);
  const loading = useAppSelector((state) => state.job.myJobsLoading);

  // Fetch user's jobs on mount
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    dispatch(fetchMyJobs());
  }, [user, navigate, dispatch]);

  // Delete job handler
  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
        toast.success("Job deleted successfully");
      } catch (error) {
        console.error("Failed to delete job:", error);
        toast.error("Failed to delete job");
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="pt-16 pb-16 max-w-7xl mx-auto lg:px-16 flex items-center justify-center min-h-[70vh]">
        <p className="text-gray-500 text-lg">Loading your jobs...</p>
      </div>
    );
  }

  // Show auth guard
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Login to View Your Jobs
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to view your posted jobs.
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (jobs.length === 0) {
    return (
      <div className="pt-16 pb-16 max-w-7xl mx-auto lg:px-16">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col items-end w-max mb-8 px-4 lg:px-0">
            <p className="text-2xl font-medium uppercase">My Jobs</p>
            <div className="w-16 h-0.5 bg-primary rounded-full"></div>
          </div>
          <div className="relative pr-4 lg:pr-0">
            <Link
              to={"/add-job"}
              className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
            >
              <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
              <span className="relative z-10 group-hover:text-white">
                + Add Job
              </span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No Jobs Posted
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't posted any jobs yet. Start by adding your first job
            opening!
          </p>
          <Link
            to={"/add-job"}
            className="relative px-6 py-2.5 rounded-full overflow-hidden group border-2 border-primary text-white bg-primary hover:bg-primary-dull inline-block"
          >
            <span className="relative z-10">+ Post Your First Job</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-16 max-w-7xl mx-auto lg:px-16">
      {/* ── Page header ── */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-end w-max mb-8 px-4 lg:px-0">
          <p className="text-lg md:text-2xl font-medium uppercase">My Jobs</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
        <div className="relative pr-4 lg:pr-0">
          <Link
            to={"/add-job"}
            className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
          >
            <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
            <span className="relative z-10 group-hover:text-white">
              + Add Job
            </span>
          </Link>
        </div>
      </div>

      {/* ── Job cards ── */}
      {jobs.map((job, index) => (
        <div
          key={job._id || index}
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-6xl shadow-xl hover:shadow"
        >
          {/* Job ID · Status */}
          <p className="flex justify-between md:items-center text-gray-600 md:font-medium max-md:flex-col">
            <span>Job ID : {job._id}</span>
            <span
              className={`text-sm px-3 py-1 rounded-full w-max ${
                job.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {job.status === "open" ? "Open" : "Closed"}
            </span>
          </p>

          {/* ── Job Details Layout ── */}
          <div className="relative bg-white text-gray-500/70 border-gray-300 flex flex-col md:flex-row md:items-start justify-between py-4 md:gap-3 w-full max-w-full">
            {/* Core details */}
            <div className="text-gray-800 lg:flex-1">
              <h2 className="text-xl font-medium">{job.title}</h2>
              <p>
                <span className="text-purple-800">Location ⟶ </span>
                {job.location}
              </p>
              <p>
                <span className="text-purple-800">Job Types ⟶ </span>
                {(job.jobTypes || []).join(", ") || "NA"}
              </p>
              <p className="text-sm">
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Compensation */}
            <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0 text-gray-800 lg:flex-1">
              <p>
                Salary Range :{" "}
                {job.salaryRange?.min != null && job.salaryRange?.max != null
                  ? `${currency}${job.salaryRange.min} - ${currency}${job.salaryRange.max}`
                  : "Not disclosed"}
              </p>
              <p>
                CTC :{" "}
                {job.ctc != null ? `${currency} ${job.ctc}` : "Not disclosed"}
              </p>
              {job.skills && job.skills.length > 0 && (
                <p>
                  <span className="text-purple-800">Skills ⟶ </span>
                  {job.skills.slice(0, 5).join(", ")}
                  {job.skills.length > 5 ? "..." : ""}
                </p>
              )}
            </div>

            {/* Description preview */}
            <div className="text-sm md:text-base text-black/60 lg:flex-1">
              <h2 className="text-purple-900 font-semibold pt-2">
                Job Description
              </h2>
              <p
                className="line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: job.description || "Not Mentioned",
                }}
              />
            </div>
          </div>

          {/* ── Footer actions ── */}
          <div className="flex justify-between mt-4 gap-2 flex-wrap">
            <div className="flex gap-2">
              <EditJobButton jobId={job._id} />
              <div>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-red-500 text-red-500 hover:text-white inline-block cursor-pointer"
                >
                  <span className="absolute inset-0 bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
                  <span className="relative z-10 group-hover:text-white">
                    Delete
                  </span>
                </button>
              </div>
            </div>
            {/* <div>
              <Link
                to={`/job-details/${job._id}`}
                className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
              >
                <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
                <span className="relative z-10 group-hover:text-white">View Job</span>
              </Link>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyJobs;
