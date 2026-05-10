import { useAppContext } from "../context/AppContext";
import { useAppDispatch } from "../store/hooks";
import { toggleWishlistItem } from "../store/slices/wishlistSlice";
import PropertyCard from "../components/PropertyCard";
import { IoHeartDislikeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { properties, wishlisted } = useAppContext();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const wishlistedProperties = properties.filter(p => wishlisted.includes(p._id));

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            {wishlistedProperties.length} saved {wishlistedProperties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
        {wishlistedProperties.length > 0 && (
          <button
            onClick={() => wishlistedProperties.forEach(p => dispatch(toggleWishlistItem(p._id)))}
            className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlistedProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <IoHeartDislikeOutline className="text-6xl mb-4" />
          <p className="text-lg font-medium">Your wishlist is empty</p>
          <p className="text-sm mt-1">Heart a property on the search page to save it here.</p>
          <button
            onClick={() => navigate('/property-search')}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dull transition"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProperties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
