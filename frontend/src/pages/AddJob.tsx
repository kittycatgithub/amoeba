// JobPostForm.tsx
import React, { useState, useRef } from 'react';

// Types
interface JobFormData {
  title: string;
  description: string; // plain HTML string from contentEditable
  skills: string[];
  status: 'open' | 'closed';
  location: 'remote' | 'hybrid' | 'on-site';
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

// Colors (previously Tailwind theme tokens)
const COLORS = {
  primary: '#1f2937',
  primaryDull: '#111827',
  secondary: '#3b82f6',
  border: '#d1d5db',
  labelGray: '#374151',
  placeholderGray: '#9ca3af',
  bgGray: '#f9fafb',
  white: '#ffffff',
  red: '#dc2626',
  redBg: '#fef2f2',
};

const JobPostForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    skills: [''],
    status: 'open',
    location: 'remote',
    salaryRange: {
      min: null,
      max: null,
    },
    ctc: null,
    jobTypes: [],
  });

  const editorRef = useRef<HTMLDivElement>(null);

  // Job types options
  const jobTypeOptions: JobTypeOption[] = [
    { value: 'contractual', label: 'Contractual / Temporary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'internship', label: 'Internship' },
    { value: 'volunteer', label: 'Volunteer' },
  ];

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle salary range changes
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : Number(value);
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
    const value = e.target.value === '' ? null : Number(e.target.value);
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
      skills: [...prev.skills, ''],
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

  // Plain contentEditable rich-text handlers (no external library)
  const applyFormat = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    syncDescriptionFromEditor();
  };

  const applyBlock = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    syncDescriptionFromEditor();
  };

  const syncDescriptionFromEditor = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        description: editorRef.current!.innerHTML,
      }));
    }
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

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job Post Data:', formData);
    // Here you would typically send the data to your API
  };

  // Standalone style function (kept outside the CSSProperties-typed map below,
  // otherwise TS forces it to be treated as a CSSProperties object instead of a function)
  const getDropdownOptionStyle = (selected: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    backgroundColor: selected ? COLORS.primary : COLORS.white,
    color: selected ? COLORS.white : 'inherit',
  });

  // --- Inline style objects ---
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: '56rem',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: COLORS.white,
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    },
    heading: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: COLORS.primary,
      marginBottom: '1.5rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    fieldGroup: {},
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: COLORS.labelGray,
      marginBottom: '0.25rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem 1rem',
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.375rem',
      outline: 'none',
      boxSizing: 'border-box',
      fontSize: '1rem',
    },
    select: {
      width: '100%',
      padding: '0.5rem 1rem',
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.375rem',
      outline: 'none',
      boxSizing: 'border-box',
      fontSize: '1rem',
      backgroundColor: COLORS.white,
    },
    editorWrapper: {
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.375rem',
      overflow: 'hidden',
    },
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.25rem',
      padding: '0.5rem',
      backgroundColor: COLORS.bgGray,
      borderBottom: `1px solid ${COLORS.border}`,
    },
    toolbarButton: {
      padding: '0.25rem 0.75rem',
      fontSize: '0.875rem',
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.25rem',
      cursor: 'pointer',
    },
    editorArea: {
      padding: '0.75rem',
      minHeight: '200px',
      outline: 'none',
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    skillRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    skillInput: {
      flex: 1,
      padding: '0.5rem 1rem',
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.375rem',
      outline: 'none',
      boxSizing: 'border-box',
      fontSize: '1rem',
    },
    removeSkillButton: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      color: COLORS.red,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
    },
    addSkillButton: {
      fontSize: '0.875rem',
      color: COLORS.secondary,
      fontWeight: 500,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    salaryRow: {
      display: 'flex',
      gap: '1rem',
    },
    salaryCol: {
      flex: 1,
    },
    smallLabel: {
      display: 'block',
      fontSize: '0.75rem',
      color: COLORS.placeholderGray,
    },
    helperText: {
      fontSize: '0.75rem',
      color: COLORS.placeholderGray,
      marginTop: '0.25rem',
    },
    jobTypeBox: {
      position: 'relative',
    },
    jobTypeSelectedBox: {
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.375rem',
      padding: '0.5rem',
      minHeight: '46px',
      boxSizing: 'border-box',
    },
    jobTypeTagsWrap: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.25rem',
    },
    jobTypePlaceholder: {
      color: COLORS.placeholderGray,
      fontSize: '0.875rem',
    },
    jobTypeTag: {
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      fontSize: '0.875rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
    },
    jobTypeTagRemove: {
      marginLeft: '0.25rem',
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
    },
    dropdown: {
      position: 'absolute',
      zIndex: 10,
      width: '100%',
      marginTop: '0.25rem',
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '0.375rem',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      maxHeight: '12rem',
      overflowY: 'auto',
    },
    submitWrapper: {
      paddingTop: '1rem',
      borderTop: `1px solid #e5e7eb`,
    },
    submitButton: {
      width: '100%',
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontWeight: 500,
      fontSize: '1rem',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Post a Job</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <div style={styles.fieldGroup}>
          <label htmlFor="title" style={styles.label}>
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={styles.input}
            placeholder="e.g., Senior Real Estate Agent"
          />
        </div>

        {/* Description with plain contentEditable text editor */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Job Description *</label>
          <div style={styles.editorWrapper}>
            {/* Toolbar */}
            <div style={styles.toolbar}>
              <button
                type="button"
                onClick={() => applyFormat('bold')}
                style={{ ...styles.toolbarButton, fontWeight: 700 }}
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormat('italic')}
                style={{ ...styles.toolbarButton, fontStyle: 'italic' }}
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormat('underline')}
                style={{ ...styles.toolbarButton, textDecoration: 'underline' }}
              >
                U
              </button>
              <button
                type="button"
                onClick={() => applyBlock('insertUnorderedList')}
                style={styles.toolbarButton}
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => applyBlock('insertOrderedList')}
                style={styles.toolbarButton}
              >
                1. List
              </button>
            </div>

            {/* Plain editable area (standard textarea-like rich editor, no external library) */}
            <div
              ref={editorRef}
              contentEditable
              onInput={syncDescriptionFromEditor}
              onBlur={syncDescriptionFromEditor}
              style={styles.editorArea}
              data-placeholder="Describe the job responsibilities, requirements, and benefits..."
              suppressContentEditableWarning
            />
          </div>
        </div>

        {/* Skills Required */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Skills Required *</label>
          {formData.skills.map((skill, index) => (
            <div key={index} style={styles.skillRow}>
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                style={styles.skillInput}
                placeholder={`Skill ${index + 1}`}
                required
              />
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkillRow(index)}
                  style={styles.removeSkillButton}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSkillRow} style={styles.addSkillButton}>
            + Add Another Skill
          </button>
        </div>

        {/* Status */}
        <div style={styles.fieldGroup}>
          <label htmlFor="status" style={styles.label}>
            Job Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Location */}
        <div style={styles.fieldGroup}>
          <label htmlFor="location" style={styles.label}>
            Job Location *
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
        </div>

        {/* Salary Range */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Salary Range (Optional)</label>
          <div style={styles.salaryRow}>
            <div style={styles.salaryCol}>
              <label htmlFor="min" style={styles.smallLabel}>
                Minimum
              </label>
              <input
                type="number"
                id="min"
                name="min"
                value={formData.salaryRange.min ?? ''}
                onChange={handleSalaryChange}
                style={styles.input}
                placeholder="e.g., 50000"
                min="0"
                step="1000"
              />
            </div>
            <div style={styles.salaryCol}>
              <label htmlFor="max" style={styles.smallLabel}>
                Maximum
              </label>
              <input
                type="number"
                id="max"
                name="max"
                value={formData.salaryRange.max ?? ''}
                onChange={handleSalaryChange}
                style={styles.input}
                placeholder="e.g., 100000"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>

        {/* CTC */}
        <div style={styles.fieldGroup}>
          <label htmlFor="ctc" style={styles.label}>
            CTC (Optional)
          </label>
          <input
            type="number"
            id="ctc"
            name="ctc"
            value={formData.ctc ?? ''}
            onChange={handleCTCChange}
            style={styles.input}
            placeholder="e.g., 1500000"
            min="0"
            step="10000"
          />
          <p style={styles.helperText}>Total Cost to Company (annual)</p>
        </div>

        {/* Job Type - Multiselect Dropdown */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Job Type *</label>
          <div style={styles.jobTypeBox}>
            <div style={styles.jobTypeSelectedBox}>
              <div style={styles.jobTypeTagsWrap}>
                {formData.jobTypes.length === 0 ? (
                  <span style={styles.jobTypePlaceholder}>Select job types...</span>
                ) : (
                  formData.jobTypes.map((type) => {
                    const option = jobTypeOptions.find((opt) => opt.value === type);
                    return option ? (
                      <span key={type} style={styles.jobTypeTag}>
                        {option.label}
                        <button
                          type="button"
                          onClick={() => handleJobTypeToggle(type)}
                          style={styles.jobTypeTagRemove}
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })
                )}
              </div>
            </div>

            {/* Dropdown options */}
            <div style={styles.dropdown}>
              {jobTypeOptions.map((option) => {
                const selected = formData.jobTypes.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleJobTypeToggle(option.value)}
                    style={getDropdownOptionStyle(selected)}
                  >
                    {option.label}
                    {selected && ' ✓'}
                  </div>
                );
              })}
            </div>
          </div>
          <p style={styles.helperText}>Select all that apply</p>
        </div>

        {/* Submit Button */}
        <div style={styles.submitWrapper}>
          <button type="submit" style={styles.submitButton}>
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;