import { useEffect, useRef, useState } from "react";
import type { Property } from "../types/propertyTypes";
import { useAppContext } from "../context/AppContext";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Props {
  property: Property;
}

const PropertyCard = ({ property }: Props) => {
  const { currency, toggleWishlist, wishlisted } = useAppContext()
  const navigate = useNavigate();
  const { _id, title, price, area, type, status, images } = property;
  const isWishlisted = wishlisted.includes(_id);

  const slides = [images[images.length - 1], ...images, images[0]];

  const [index, setIndex] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef(0);

  // autoplay
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(intervalRef.current!);
  }, []);

  // move slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.style.transition = "transform 0.5s ease";
    slider.style.transform = `translateX(-${index * 100}%)`;
  }, [index]);

  // seamless reset
  // const handleTransitionEnd = () => {
  //   const slider = sliderRef.current;
  //   if (!slider) return;

  //   if (index === slides.length - 1) {
  //     slider.style.transition = "none";
  //     setIndex(1);

  //     requestAnimationFrame(() => {
  //       slider.style.transform = `translateX(-100%)`;
  //     });
  //   }

  //   if (index === 0) {
  //     slider.style.transition = "none";
  //     setIndex(slides.length - 2);

  //     requestAnimationFrame(() => {
  //       slider.style.transform = `translateX(-${(slides.length - 2) * 100}%)`;
  //     });
  //   }
  // };

  const handleTransitionEnd = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    // ✅ Use functional updater to always read latest index
    setIndex((current) => {
      if (current === slides.length - 1) {
        slider.style.transition = "none";
        requestAnimationFrame(() => {
          slider.style.transform = `translateX(-100%)`;
        });
        return 1;
      }

      if (current === 0) {
        slider.style.transition = "none";
        requestAnimationFrame(() => {
          slider.style.transform = `translateX(-${(slides.length - 2) * 100}%)`;
        });
        return slides.length - 2;
      }

      return current;
    });
  };

  // swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    clearInterval(intervalRef.current!);
  };

  // const handleTouchEnd = (e: React.TouchEvent) => {
  //   const diff = touchStartX.current - e.changedTouches[0].clientX;

  //   if (diff > 50) setIndex((prev) => prev + 1);
  //   if (diff < -50) setIndex((prev) => prev - 1);

  //   intervalRef.current = setInterval(() => {
  //     setIndex((prev) => prev + 1);
  //   }, 2000);
  // };

  // handleTouchEnd — fix the interval duration

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) setIndex((prev) => prev + 1);
    if (diff < -50) setIndex((prev) => prev - 1);

    // ✅ Was 2000, must match the original 10000
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 10000);
  };

  return (
    <div
      className="bg-white flex flex-col justify-between rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/property-details/${_id}`)}
      title={title}
    >
      <div>
 {/* SLIDER */}
      <div
        className="relative h-48 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={sliderRef}
          onTransitionEnd={handleTransitionEnd}
          className="flex"
        >
          {slides.map((img, i) => (
            <img
              key={i}
              src={`${import.meta.env.VITE_API_URL}${img}?w=600&auto=format&fit=crop&q=60`}
              className="w-full h-48 object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* DOTS */}
        <div className="absolute bottom-2 w-full flex justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === index - 1 ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-4">
        <div className="flex flex-row justify-between items-start">
        <h3 className="font-semibold text-lg">{title}</h3>
        <button title="Wishlist Property" onClick={(e) => { e.stopPropagation(); toggleWishlist(_id); }} className="relative cursor-pointer">
          {isWishlisted
            ? <IoHeart className="text-2xl text-themered-dull" />
            : <IoHeartOutline className="text-2xl text-themered-dull" />
          }
        </button>
        </div>
        <p className="text-gray-600">{type}</p>
        <p className="text-gray-600">{status}</p>
        <p className="font-bold mt-2">
          {currency}{price} • {area}
        </p>        
      </div>
      </div>
      
     
      <button className="mt-3 w-full bg-primary text-white py-2 rounded-b-lg">
          View Property
        </button>
    </div>
  );
};

export default PropertyCard;
