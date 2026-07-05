import { Link } from 'react-router-dom';

const currency = '₹';

interface JobCardProps {
  job: any;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
          <span
            className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
              job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {job.status === 'open' ? 'Open' : 'Closed'}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1 capitalize">{job.location}</p>

        {job.jobTypes?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {job.jobTypes.slice(0, 3).map((type: string) => (
              <span key={type} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                {type.replace('-', ' ')}
              </span>
            ))}
          </div>
        )}

        {job.skills?.length > 0 && (
          <p className="text-sm text-gray-600 mt-3">
            <span className="text-purple-800">Skills ⟶ </span>
            {job.skills.slice(0, 4).join(', ')}
            {job.skills.length > 4 ? '...' : ''}
          </p>
        )}

        <div
          className="text-sm text-gray-500 mt-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: job.description || 'No description provided' }}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {job.ctc != null ? (
            <span className="font-medium">{currency} {job.ctc} CTC</span>
          ) : job.salaryRange?.min != null && job.salaryRange?.max != null ? (
            <span className="font-medium">
              {currency}{job.salaryRange.min} - {currency}{job.salaryRange.max}
            </span>
          ) : (
            <span className="text-gray-400">Salary not disclosed</span>
          )}
        </div>
        <Link
          to={`/job-details/${job._id}`}
          className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary hover:text-white inline-block text-sm"
        >
          <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
          <span className="relative z-10 group-hover:text-white">View Job</span>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;