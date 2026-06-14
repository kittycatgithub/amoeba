import React, { useState, useMemo, useCallback, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { TfiLocationPin, TfiRulerAlt2 } from "react-icons/tfi";
import { IoHeartOutline, IoHeart, IoShareSocialOutline, IoClose } from "react-icons/io5";
import { TbBed } from "react-icons/tb";
import { PiBathtub, PiPhoneCallFill } from "react-icons/pi";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaTelegramPlane,
  FaLink,
} from "react-icons/fa";
import ImageDrawer from "../components/ImageDrawer";
import { ImageCategory, type CategorizedImage } from "../types/imageTypes";
import { useAppContext } from "../context/AppContext";
import { useAppSelector } from "../store/hooks";
// import { toggleShortlistItem } from "../store/slices/shortlistSlice";
import PropertyPosterInfo from "../components/SellerInfoCard";
import { LiaHomeSolid } from "react-icons/lia";
import PropertyCard from "../components/PropertyCard";

// Lazy load heavy components
const AmenitiesSection = lazy(() => import("../components/AmenitiesSection"));

// House rules data
// const houseRules = [
//   { icon: "🚭", rule: "No smoking", detail: "Smoking not allowed indoors" },
//   { icon: "🐾", rule: "Pets allowed", detail: "Pets are welcome with approval" },
//   { icon: "🎵", rule: "No noise after 11 PM", detail: "Keep noise levels low after 11 PM" },
//   { icon: "🧴", rule: "Keep property clean", detail: "Return property in same condition" },
// ];


const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleWishlist, wishlisted, navigate, currency } = useAppContext();
  // const dispatch = useAppDispatch();
  // Fetching properties from Redux slice instead of AppContext
  const properties = useAppSelector(state => state.property.properties ?? []);
  // const shortlisted = useAppSelector(state => state.shortlist.ids);

  const property = properties.find(p => p._id === id);
  const isWishlisted = property ? wishlisted.includes(property._id) : false;
  // const isShortlisted = property ? shortlisted.includes(property._id) : false;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Build categorized images from property images array
  const categorizedImages: CategorizedImage[] = useMemo(() => {
    if (!property) return [];
    const cats = [ImageCategory.HALL, ImageCategory.BEDROOM, ImageCategory.BATHROOM];
    return property.images.map((url: string, i: number) => ({
      id: `img-${i}`,
      url,
      category: cats[i % cats.length],
    }));
  }, [property]);

  const galleryImages = useMemo(() => categorizedImages.map(img => img.url), [categorizedImages]);

  const handleImageGalleryClick = useCallback(() => setIsDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setIsDrawerOpen(false), []);

  // Share handlers
  const propertyUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = property ? `${property.title} – ${property.location}` : "Property";

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // fallback silent fail
    }
  }, [propertyUrl]);

  const shareOptions = useMemo(() => [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={18} />,
      color: "bg-green-500 hover:bg-green-600",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} – ${propertyUrl}`)}`,
    },
    {
      label: "Facebook",
      icon: <FaFacebookF size={16} />,
      color: "bg-blue-600 hover:bg-blue-700",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
    },
    {
      label: "Twitter / X",
      icon: <FaTwitter size={17} />,
      color: "bg-sky-500 hover:bg-sky-600",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(propertyUrl)}`,
    },
    {
      label: "Telegram",
      icon: <FaTelegramPlane size={17} />,
      color: "bg-blue-400 hover:bg-blue-500",
      href: `https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
  ], [shareTitle, propertyUrl]);

  // Property not found
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <p className="text-xl font-semibold">Property not found</p>
        <button
          onClick={() => navigate('/property-search')}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dull transition"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
    <div className="min-h-screen bg-gray-50 max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row">
          {/* MAIN IMAGE SECTION */}
      <div
        className="relative overflow-hidden cursor-pointer lg:w-1/2"
        style={{ aspectRatio: "16 / 10" }}
        onClick={handleImageGalleryClick}
      >
        <img
          src={galleryImages[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hover:bg-black/0 transition"></div>
        <button className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold transition">
          View all {galleryImages.length} photos
        </button>
        {/* Status badge */}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${
          property.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {property.status}
        </span>
      </div>
       {/* HEADER SECTION */}
        <div className="px-4 md:px-6 py-6 border-b border-gray-200">
          <div className="flex flex-col justify-between items-start gap-4">
            <div className="flex-1">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {property.category}
              </span>
              <h1 className="text-xl md:text-xl font-medium text-gray-800 mt-2 mb-1">
                {property.title}
              </h1>
              <p className="text-gray-500 text-sm mb-3">{property.type}</p>

              <div className="flex items-center gap-2 text-primary">
                <TfiLocationPin size={16} />
                <span className="text-sm font-medium">{property.location}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="text-xl text-black">{currency}{property.price}</div>

              {/* ── Action buttons row ── */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(property._id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition ${
                    isWishlisted
                      // ? 'bg-primary/10 border-primary/30 text-themered-dull'
                      ? ' border-themered-dull text-themered-dull'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 pr-8'
                  }`}
                >
                  {isWishlisted ? <IoHeart /> : <IoHeartOutline />}
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>

                {/* Shortlist */}
                {/* <button
                  onClick={() => dispatch(toggleShortlistItem(property._id))}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition ${
                    isShortlisted
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {isShortlisted ? <TbBookmarkFilled /> : <TbBookmark />}
                  Shortlist
                </button> */}

                {/* Share button */}
                <div className="relative">
                  <button
                    onClick={() => setIsShareOpen(prev => !prev)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition"
                  >
                    <IoShareSocialOutline size={16} />
                    Share
                  </button>

                  {/* Share dropdown */}
                  {isShareOpen && (
                    <div className="absolute left-0 top-11 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-52">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Share via</span>
                        <button onClick={() => setIsShareOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                          <IoClose size={15} />
                        </button>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {shareOptions.map(opt => (
                          <a
                            key={opt.label}
                            href={opt.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-white text-sm font-medium transition ${opt.color}`}
                            onClick={() => setIsShareOpen(false)}
                          >
                            {opt.icon}
                            {opt.label}
                          </a>
                        ))}
                        {/* Copy link */}
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
                        >
                          <FaLink size={14} />
                          {copySuccess ? "Copied!" : "Copy link"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Now — OLD BUTTON (commented out) */}
                {/* <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-semibold transition">
                  Contact Now
                </button> */}

                {/* Contact Now — Call button with icon in circle */}
                {/* <a
                  href={`tel:${property.owner?.phone}`}
                  className="flex items-center gap-2.5 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full font-semibold text-sm transition shadow-sm"
                  title={`Call ${property.owner?.name ?? 'owner'}`}
                >
                  Call icon in a circle
                  <span className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full flex-shrink-0">
                    <PiPhoneCallFill size={15} />
                  </span>
                  Contact Now
                </a> */}
                <a
                  href={`tel:${property.owner?.phone}`}
                  className="flex items-center gap-2.5 bg-primary hover:bg-primary/80 text-white pl-1 py-1 pr-4 rounded-full font-semibold text-sm transition shadow-sm"
                  title={`Call ${property.owner?.name ?? 'owner'}`}
                >
                  {/* Call icon in a circle */}
                  <span className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full flex-shrink-0">
                    <PiPhoneCallFill size={15} />
                  </span>
                  Call
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
      

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto">
        {/* Image Drawer */}
        <ImageDrawer
          isOpen={isDrawerOpen}
          images={categorizedImages}
          onClose={handleDrawerClose}
        />      

        {/* PROPERTY HIGHLIGHTS */}
        <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Property Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <TbBed />, label: "Bedrooms", value: property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A' },
              { icon: <PiBathtub />, label: "Bathrooms", value: property.bathrooms > 0 ? `${property.bathrooms}` : 'N/A' },
              // { icon: <FaRulerCombined />, label: "Area", value: `${property.area} sqft` },
              // { icon: <TfiRulerAlt2 />, label: "Area", value: `${property.area} sqft` },
              { icon: <TfiRulerAlt2 />, label: "Area", value: `${property.area}` },
              { icon: <LiaHomeSolid />, label: "Furnishing", value: property.furnishing },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl text-primary">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT PROPERTY */}
        <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-3">About this property</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>

          {/* Posted by / Available for */}
          <div className="mt-4 flex flex-wrap gap-3">
            {/* <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Posted by: {property.postedBy}
            </span> */}
            <p className="text-sm text-gray-700 self-center">Available For -</p>
            {property.availableFor?.map((a: string) => (
              <span key={a} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* AMENITIES */}
        {property.amenities?.length > 0 && (
          <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Amenities</h2>
            <Suspense fallback={<div className="h-24" />}>
              <AmenitiesSection selectedAmenities={property.amenities} />
            </Suspense>
          </div>
        )}

        {/* HOUSE RULES */}
        {/* <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">House Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {houseRules.map((rule, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-xl flex-shrink-0">{rule.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{rule.rule}</p>
                  <p className="text-xs text-gray-600">{rule.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* CANCELLATION POLICY */}
        {/* <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cancellation Policy</h2>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <MdCheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Free Cancellation</p>
                <p className="text-xs text-gray-600">Cancel until 48 hours before check-in for full refund</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="flex-shrink-0 text-lg">⚠️</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Non-Refundable Rate Available</p>
                <p className="text-xs text-gray-600">Book at lower rate with no cancellation option</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* CONTACT */}
        {/* <div className="bg-white px-4 md:px-6 py-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Contact & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-semibold text-gray-800">+91 80 4043 1111</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-800">contact@predi.in</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">City</p>
              <p className="font-semibold text-gray-800">{property.city}</p>
            </div>
          </div>
        </div> */}
      </div>
        {/* <PropertyPosterInfo /> */}
        <PropertyPosterInfo owner={property.owner} />
    </div>

      {/* -------------- Related Properties -------------- */}
      <div className="flex flex-col items-center max-w-7xl mx-auto py-6">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Properties</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>

        {(() => {
          const related = properties
            .filter((p) => p.status === "Available" && p.location === property.location);

          return related.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-4 mt-6 w-full px-6 md:px-0">
              {related.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-6">No related properties found.</p>
          );
        })()}
        <button onClick={()=> {navigate('/property-search'); scrollTo(0,0)}} className="mx-auto cursor-pointer px-12 my-6 py-2.5 border text-primary hover:bg-primary/10 transition rounded-lg">
            See More
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;