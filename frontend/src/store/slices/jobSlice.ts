import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/jobs`;

// ─── Types ────────────────────────────────────────────────

export interface Job {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  status: 'open' | 'closed';
  location: 'remote' | 'hybrid' | 'on-site';
  workLocation: { city: string; state: string };
  salaryRange: { min: number | null; max: number | null };
  ctc: number | null;
  jobTypes: string[];
  owner?: { _id: string; name: string; email: string; phone?: string; role?: string };
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  status?: string;
  location?: string;
  search?: string;
  minCtc?: number;
  maxCtc?: number;
  jobTypes?: string;
  skills?: string;
  postedBy?: string;
}

export interface JobPayload {
  title: string;
  description: string;
  skills: string[];
  status: 'open' | 'closed';
  location: 'remote' | 'hybrid' | 'on-site';
  workLocation: { city: string; state: string };
  salaryRange: { min: number | null; max: number | null };
  ctc: number | null;
  jobTypes: string[];
}

// ─── Thunks (API called directly inside, no separate api file) ─────

// List (paginated, filterable)
export const fetchJobs = createAsyncThunk(
  'job/fetchAll',
  async (filters: JobFilters | undefined = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${API_BASE}`, { params: filters });
      return data; // { jobs, total, page, pages }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch jobs');
    }
  },
);

// Single job (for JobDetails page)
export const fetchJobById = createAsyncThunk(
  'job/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${API_BASE}/${id}`);
      return data.job as Job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch job');
    }
  },
);

// My jobs (owner dashboard)
export const fetchMyJobs = createAsyncThunk(
  'job/fetchMine',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${API_BASE}/user/my-jobs`);
      return data.jobs as Job[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch your jobs');
    }
  },
);

// Create
export const createJob = createAsyncThunk(
  'job/create',
  async (payload: Partial<JobPayload>, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`${API_BASE}`, payload);
      return data.job as Job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to create job');
    }
  },
);

// Update
export const updateJob = createAsyncThunk(
  'job/update',
  async (
    { id, payload }: { id: string; payload: Partial<JobPayload> },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.put(`${API_BASE}/${id}`, payload);
      return data.job as Job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to update job');
    }
  },
);

// Delete
export const deleteJob = createAsyncThunk(
  'job/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to delete job');
    }
  },
);

// ─── State ────────────────────────────────────────────────

interface JobState {
  jobs: Job[];
  myJobs: Job[];
  currentJob: Job | null;
  total: number;
  page: number;
  pages: number;
  loading: boolean;       // list loading
  jobLoading: boolean;    // single job loading
  myJobsLoading: boolean;
  mutating: boolean;      // create/update/delete in-flight
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  myJobs: [],
  currentJob: null,
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  jobLoading: false,
  myJobsLoading: false,
  mutating: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchJobs (list) ──
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── fetchJobById (single) ──
      .addCase(fetchJobById.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
        state.currentJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.jobLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload as string;
      })

      // ── fetchMyJobs ──
      .addCase(fetchMyJobs.pending, (state) => {
        state.myJobsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.myJobsLoading = false;
        state.myJobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.myJobsLoading = false;
        state.error = action.payload as string;
      })

      // ── createJob ──
      .addCase(createJob.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.mutating = false;
        state.myJobs.unshift(action.payload);
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload as string;
      })

      // ── updateJob ──
      .addCase(updateJob.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.mutating = false;
        const updated = action.payload;
        state.jobs = state.jobs.map((j) => (j._id === updated._id ? updated : j));
        state.myJobs = state.myJobs.map((j) => (j._id === updated._id ? updated : j));
        if (state.currentJob?._id === updated._id) state.currentJob = updated;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload as string;
      })

      // ── deleteJob ──
      .addCase(deleteJob.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.mutating = false;
        const id = action.payload;
        state.jobs = state.jobs.filter((j) => j._id !== id);
        state.myJobs = state.myJobs.filter((j) => j._id !== id);
        if (state.currentJob?._id === id) state.currentJob = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentJob, clearJobError } = jobSlice.actions;
export default jobSlice.reducer;