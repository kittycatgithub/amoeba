import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getMyPropertiesApi } from '../api/propertyApi';
import { toast } from 'react-hot-toast';

const currency = "₹";


// Kept for API compatibility
// const saleProducts: any[] = [];

// ─── Edit Button ──────────────────────────────────────────────────────────────

const EditPropertyButton = ({ orderId }: { orderId: string }) => (
  <div>
  <Link
    to={`/edit-property/${orderId}`}
    className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary hover:text-white inline-block"
  >
    <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
    <span className="relative z-10 group-hover:text-white">Edit Property</span>
  </Link>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const MyProperties = () => {
  // const { user, userProfile } = useAppContext();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's properties on mount
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserProperties = async () => {
      try {
        const { data } = await getMyPropertiesApi();
        setProperties(data.properties || []);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        toast.error('Failed to load your properties');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [user, navigate]);

  // Delete property handler
  // const handleDeleteProperty = async (propertyId: string) => {
  //   if (window.confirm('Are you sure you want to delete this property?')) {
  //     try {
  //       await deletePropertyApi(propertyId);
  //       setProperties(prev => prev.filter(p => p._id !== propertyId));
  //       toast.success('Property deleted successfully');
  //     } catch (error) {
  //       console.error('Failed to delete property:', error);
  //       toast.error('Failed to delete property');
  //     }
  //   }
  // };

  // Show loading state
  if (loading) {
    return (
      <div className='pt-16 pb-16 max-w-7xl mx-auto lg:px-16 flex items-center justify-center min-h-[70vh]'>
        <p className='text-gray-500 text-lg'>Loading your properties...</p>
      </div>
    );
  }

  // Show auth guard
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to View Your Properties</h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to view your listed properties.
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (properties.length === 0) {
    return (
      <div className='pt-16 pb-16 max-w-7xl mx-auto lg:px-16'>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col items-end w-max mb-8 px-4 lg:px-0'>
            <p className='text-2xl font-medium uppercase'>My Properties</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
          </div>
          <div className="relative pr-4 lg:pr-0">
            <Link
              to={'/add-property'}
              className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
            >
              <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
              <span className="relative z-10 group-hover:text-white">+ Add Property</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Properties Listed</h3>
          <p className="text-gray-500 mb-6">You haven't posted any properties yet. Start by adding your first property!</p>
          <Link
            to={'/add-property'}
            className="relative px-6 py-2.5 rounded-full overflow-hidden group border-2 border-primary text-white bg-primary hover:bg-primary-dull inline-block"
          >
            <span className="relative z-10">+ Post Your First Property</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='pt-16 pb-16 max-w-7xl mx-auto lg:px-16'>

      {/* ── Page header ── */}
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col items-end w-max mb-8 px-4 lg:px-0'>
          <p className='text-lg md:text-2xl font-medium uppercase'>My Properties</p> 
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
        {/* <p>{properties?.length} properties found</p> */}
        <div className="relative pr-4 lg:pr-0">
          <Link
            to={'/add-property'}
            className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
          >
            <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
            <span className="relative z-10 group-hover:text-white">+ Add Property</span>
          </Link>
        </div>
      </div>

      {/* ── Property cards ── */}
      {properties.map((property, index) => (
        <div key={property._id || index} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-6xl shadow-xl hover:shadow">

          {/* Property ID · Payment Mode · Status */}
          <p className="flex justify-between md:items-center text-gray-600 md:font-medium max-md:flex-col">
            <span>Property ID : {property._id}</span>
          </p>

          {/* ── Property Details Layout ── */}
          {/* <div className={`relative bg-white text-gray-500/70 border-gray-300 flex flex-col md:flex-row md:items-start justify-between py-4 md:gap-3 w-full max-w-4xl`}> */}
          <div className={`relative bg-white text-gray-500/70 border-gray-300 flex flex-col md:flex-row md:items-start justify-between py-4 md:gap-3 w-full max-w-full`}>

            {/* Thumbnail + core details */}
            <div className="flex items-center mb-4 md:mb-0 lg:flex-1">
              <div className="bg-primary/10 p-1 rounded-lg">
                <img
                  // src={`${import.meta.env.VITE_API_URL}${property.images?.[0]}` || "https://via.placeholder.com/100"}
                  src={property.images[0]}
                  alt={property.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              <div className="ml-4 text-gray-800 w-[200px]">
                <h2 className="text-xl font-medium">Details</h2>
                <p>Availability : {property.availability || "Not Selected"}</p>
                <p>Price : {currency} {property.price || "NA"}</p>
                <p>Config : {property.bedrooms} Bed · {property.bathrooms} Bath · {property.area || "NA"}</p>
                <p className="text-sm">Listed on: {new Date(property.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-900 text-md font-medium">
                  Amount : {currency} {property.price}
                </p>
              </div>
            </div>

            {/* Property name + details */}
            <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0 text-gray-800  lg:flex-1">
              <h2 className="text-xl font-medium">{property.title}</h2>
              <div>
                <p><span className="text-purple-800">Role ⟶ </span>{property.postedBy || "Owner"}</p>
                <p><span className="text-purple-800">Category ⟶ </span>{property.category || "NA"}</p>
                <p><span className="text-purple-800">Property Type ⟶ </span>{property.type || "NA"}</p>
                {property.furnishing && (
                  <p><span className="text-purple-800">Furnishing ⟶ </span>{property.furnishing}</p>
                )}
                {property.availableFor && property.availableFor.length > 0 && (
                  <p><span className="text-purple-800">Available For ⟶ </span>{property.availableFor.join(", ")}</p>
                )}
                {property.amenities && property.amenities.length > 0 && (
                  <p><span className="text-purple-800">Amenities ⟶ </span>{property.amenities.slice(0, 3).join(", ")}{property.amenities.length > 3 ? '...' : ''}</p>
                )}
              </div>
            </div>

            {/* Location info */}
            <div className="text-sm md:text-base text-black/60  lg:flex-1">
              <p className="text-black/80 font-semibold">{property.location}</p>
              <p className="text-gray-600">{property.city}, India</p>
              <div>
                <h2 className="text-purple-900 font-semibold pt-2">Property Description</h2>
                <p className='line-clamp-3'>{property.description ? property.description : "Not Mentioned"}</p>
              </div>
            </div>
          </div>

          {/* ── Footer actions ── */}
          <div className='flex justify-between mt-4 gap-2 flex-wrap'>
            <div className="flex gap-2">
              <EditPropertyButton orderId={property._id} />
              {/* <button
                onClick={() => handleDeleteProperty(property._id)}
                className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-red-500 text-red-500 hover:text-white inline-block"
              >
                <span className="absolute inset-0 bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
                <span className="relative z-10 group-hover:text-white">Delete</span>
              </button> */}
            </div>
            <div>
              <Link
                to={`/property-details/${property._id}`}
                className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
              >
                <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
                <span className="relative z-10 group-hover:text-white">View Property</span>
              </Link>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default MyProperties;