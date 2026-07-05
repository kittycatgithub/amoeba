import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getJobsApi, type JobFilters } from '../../api/jobApi';

// ─── Types ────────────────────────────────────────────────

export interface FetchJobsParams {
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

// ─── Thunk ────────────────────────────────────────────────

export const fetchJobs = createAsyncThunk(
  'job/fetchAll',
  async (filters: JobFilters | undefined = {}, { rejectWithValue }) => {
    try {
      const { data } = await getJobsApi(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch jobs');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────

interface JobState {
  jobs: any[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default jobSlice.reducer;