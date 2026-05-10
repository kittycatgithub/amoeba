import React, { useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface ImageType {
  id: number;
  url: string;
  category: "All" | "Room" | "Lobby" | "Reception" | "Facade";
}

const images: ImageType[] = [
  { id: 1, url: "/house.jpg", category: "Room" },
  { id: 2, url: "https://images.unsplash.com/photo-1582719508461-905c673771fd", category: "Room" },
  { id: 3, url: "https://images.unsplash.com/photo-1590490360182-c33d57733427", category: "Lobby" },
  { id: 4, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", category: "Reception" },
  { id: 5, url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511", category: "Facade" },
];

const categories = ["All", "Room", "Lobby", "Reception", "Facade"] as const;

const PropertyDetails: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openViewer = (index: number) => setSelectedIndex(index);
  const closeViewer = () => setSelectedIndex(null);

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) =>
        prev === 0 ? filteredImages.length - 1 : prev! - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-semibold">
            {filteredImages.length} images
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto px-4 gap-6 text-sm font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pb-2 whitespace-nowrap border-b-2 transition ${
                activeCategory === cat
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Section Title */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">{activeCategory}</h3>
          <span className="text-gray-500 text-sm">
            {filteredImages.length} images
          </span>
        </div>
      </div>

      {/* Image Grid */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((img, index) => (
          <div
            key={img.id}
            onClick={() => openViewer(index)}
            className="rounded-xl overflow-hidden cursor-pointer bg-white shadow-sm"
          >
            <img
              src={img.url}
              alt="property"
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Viewer */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <span>
              {selectedIndex + 1} / {filteredImages.length}
            </span>
            <button onClick={closeViewer}>
              <FaTimes size={22} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <button
              onClick={prevImage}
              className="absolute left-4 text-white"
            >
              <FaChevronLeft size={28} />
            </button>

            <img
              src={filteredImages[selectedIndex].url}
              alt="fullscreen"
              className="max-h-[80vh] w-auto object-contain"
            />

            <button
              onClick={nextImage}
              className="absolute right-4 text-white"
            >
              <FaChevronRight size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Price Bar (Mobile Style) */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 flex justify-between items-center">
        <div>
          <div className="text-xl font-bold text-black">₹1050</div>
          <div className="text-sm text-gray-500 line-through">₹2777</div>
          <div className="text-sm text-blue-600">+ ₹150 taxes & fees</div>
        </div>
        <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold">
          Book now & pay at hotel
        </button>
      </div> */}
    </div>
  );
};

export default PropertyDetails;
