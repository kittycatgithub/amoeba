import { useAppContext } from "../context/AppContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleShortlistItem } from "../store/slices/shortlistSlice";
import PropertyCard from "../components/PropertyCard";
import { TbBookmarkOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Shortlisted = () => {
  const { shortlisted } = useAppContext();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const properties = useAppSelector(state => state.property.properties); // adjust key if needed
  const shortlistedProperties = properties.filter(p => shortlisted.includes(p._id));

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shortlisted Properties</h1>
          <p className="text-sm text-gray-500 mt-1">
            {shortlistedProperties.length} shortlisted {shortlistedProperties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
        {shortlistedProperties.length > 0 && (
          <button
            onClick={() => shortlistedProperties.forEach(p => dispatch(toggleShortlistItem(p._id)))}
            className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {shortlistedProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <TbBookmarkOff className="text-6xl mb-4" />
          <p className="text-lg font-medium">No shortlisted properties yet</p>
          <p className="text-sm mt-1">Shortlist properties to compare them side by side.</p>
          <button
            onClick={() => navigate('/property-search')}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dull transition"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shortlistedProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {shortlistedProperties.length >= 2 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <p className="text-sm text-blue-700 font-medium">
                Compare feature coming soon — shortlisted {shortlistedProperties.length} properties ready.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shortlisted;
