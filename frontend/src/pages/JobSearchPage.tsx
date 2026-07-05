// JobSearchPage.tsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/job/JobCard";
import { BsFilterRight } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FaSearch, FaBriefcase } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { type JobFilters } from "../api/jobApi";
import { fetchJobs } from "../store/slices/jobSlice";
import JobSidebar from "../components/job/JobSidebar";
import { resetJobFilters, setJobFilters, setSearchQuery } from "../store/slices/filterJobSlice";

const JobSearchPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobs = useAppSelector((state) => state.job.jobs ?? []);
  const total = useAppSelector((state) => state.job.total ?? 0);
  const filters = useAppSelector((state) => state.jobFilters);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const hasMountFetched = useRef(false);

  // ── Helper: build JobFilters from Redux filter state ───────────────────────
  const buildFetchParams = (f: typeof filters): JobFilters => ({
    page: 1,
    status: f.status || undefined,
    search: f.searchQuery || undefined,
    minCtc: f.minCtc || undefined,
    maxCtc: f.maxCtc || undefined,
    location: f.location.length ? f.location : undefined,
    jobTypes: f.jobTypes.length ? f.jobTypes : undefined,
    skills: f.skills.length ? f.skills : undefined,
  });

  // ── On mount: hydrate Redux from URL params then fetch ─────────────────────
  useEffect(() => {
    const p = Object.fromEntries(searchParams.entries());

    const hydratedFilters = {
      status: p.status || "",
      searchQuery: p.search || "",
      minCtc: Number(p.minCtc) || 0,
      maxCtc: Number(p.maxCtc) || 0,
      location: p.location ? p.location.split(",") : [],
      jobTypes: p.jobTypes ? p.jobTypes.split(",") : [],
      skills: p.skills ? p.skills.split(",") : [],
    };

    dispatch(setJobFilters(hydratedFilters));
    if (p.search) setSearchInput(p.search);

    dispatch(fetchJobs(buildFetchParams(hydratedFilters as typeof filters)));

    hasMountFetched.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── On filter change: update URL + re-fetch ────────────────────────────────
  useEffect(() => {
    if (!hasMountFetched.current) return;

    const params: Record<string, string> = {};
    if (filters.status) params.status = filters.status;
    if (filters.searchQuery) params.search = filters.searchQuery;
    if (filters.minCtc > 0) params.minCtc = String(filters.minCtc);
    if (filters.maxCtc > 0) params.maxCtc = String(filters.maxCtc);
    if (filters.location.length) params.location = filters.location.join(",");
    if (filters.jobTypes.length) params.jobTypes = filters.jobTypes.join(",");
    if (filters.skills.length) params.skills = filters.skills.join(",");

    setSearchParams(params, { replace: true });
    dispatch(fetchJobs(buildFetchParams(filters)));
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Close drawer on outside click ─────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node))
        setIsDrawerOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => dispatch(setSearchQuery(searchInput.trim()));

  const hasActiveFilters = Boolean(
    filters.status ||
      filters.searchQuery ||
      filters.minCtc > 0 ||
      filters.maxCtc > 0 ||
      filters.location.length > 0 ||
      filters.jobTypes.length > 0 ||
      filters.skills.length > 0
  );

  return (
    <div className="flex">
      <JobSidebar />
      <main className="flex-1 p-4 bg-[#f7f7f7] min-h-screen">

        <div className="flex gap-2 mb-4">
          <div className="flex flex-1 items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white hover:border-primary transition">
            <FaBriefcase className="text-primary flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Job title or skill"
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); dispatch(setSearchQuery("")); }}>
                <IoClose />
              </button>
            )}
          </div>
          <button onClick={handleSearch} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-xl text-sm font-medium transition">
            <FaSearch />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs md:text-sm text-gray-800">
              {total} {total === 1 ? "job" : "jobs"} found
            </h2>
            {hasActiveFilters && (
              <button onClick={() => dispatch(resetJobFilters())} className="text-xs text-primary underline">
                Clear filters
              </button>
            )}
          </div>
          <button onClick={() => setIsDrawerOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-lg transition hover:bg-blue-100">
            <BsFilterRight className="text-lg" />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((j) => <JobCard key={j._id} job={j} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-black">
            <p className="text-lg font-medium">No jobs match your filters</p>
            <button onClick={() => dispatch(resetJobFilters())} className="mt-3 text-primary underline text-sm">
              Reset all filters
            </button>
          </div>
        )}
      </main>

      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-full bg-white z-40 shadow-2xl transform transition-transform duration-300 lg:hidden ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <IoClose className="text-2xl" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
          <JobSidebar isDrawer={true} />
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;