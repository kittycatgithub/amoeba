import Job from '../models/Job.js';

// ─── Create Job ─────────────────────────────────────────────
export const createJob = async (req, res) => {
  try {
    const {
      title, description, skills, status, location, workLocation,
      salaryRange, ctc, jobTypes,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Job title is required' });
    }

    const job = await Job.create({
      title,
      description: description || '',
      skills: Array.isArray(skills) ? skills.filter(Boolean) : [],
      status: status || 'open',
      location: location || 'remote',
      workLocation: {
        city: workLocation?.city?.trim() || '',
        state: workLocation?.state?.trim() || '',
      },
      salaryRange: {
        min: salaryRange?.min ?? null,
        max: salaryRange?.max ?? null,
      },
      ctc: ctc ?? null,
      jobTypes: Array.isArray(jobTypes) ? jobTypes : [],
      postedBy: req.user.role,
      owner: req.user._id,
      updatedBy: req.user._id,
    });

    res.status(201).json({ message: 'Job posted', job });
  } catch (err) {
    console.error('createJob error:', err);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

// ─── Get All Jobs (with filters + pagination) ───────────────
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1, limit = 50, status, location, search,
      minCtc, maxCtc, jobTypes, skills, postedBy,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (location) filter.location = { $in: location.split(',') };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }
    if (minCtc) filter.ctc = { ...filter.ctc, $gte: Number(minCtc) };
    if (maxCtc) filter.ctc = { ...filter.ctc, $lte: Number(maxCtc) };
    if (jobTypes) filter.jobTypes = { $in: jobTypes.split(',') };
    if (skills) filter.skills = { $in: skills.split(',') };
    if (postedBy) filter.postedBy = { $in: postedBy.split(',') };

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('owner', 'name email phone role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('getJobs error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

// ─── Get Single Job ──────────────────────────────────────────
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('owner', 'name email phone avatar role');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    console.error('getJob error:', err);
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};

// ─── Get My Jobs ─────────────────────────────────────────────
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    console.error('getMyJobs error:', err);
    res.status(500).json({ message: 'Failed to fetch your jobs' });
  }
};

// ─── Update Job ──────────────────────────────────────────────
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const {
      title, description, skills, status, location, workLocation,
      salaryRange, ctc, jobTypes,
    } = req.body;

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (skills !== undefined) job.skills = Array.isArray(skills) ? skills.filter(Boolean) : [];
    if (status !== undefined) job.status = status;
    if (location !== undefined) job.location = location;
    if (workLocation !== undefined) {
      job.workLocation = {
        city: workLocation?.city?.trim() || '',
        state: workLocation?.state?.trim() || '',
      };
    }
    if (salaryRange !== undefined) {
      job.salaryRange = {
        min: salaryRange?.min ?? null,
        max: salaryRange?.max ?? null,
      };
    }
    if (ctc !== undefined) job.ctc = ctc;
    if (jobTypes !== undefined) job.jobTypes = Array.isArray(jobTypes) ? jobTypes : [];

    job.updatedBy = req.user._id;
    await job.save();
    res.json({ message: 'Job updated', job });
  } catch (err) {
    console.error('updateJob error:', err);
    res.status(500).json({ message: 'Failed to update job' });
  }
};

// ─── Delete Job ──────────────────────────────────────────────
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('deleteJob error:', err);
    res.status(500).json({ message: 'Failed to delete job' });
  }
};