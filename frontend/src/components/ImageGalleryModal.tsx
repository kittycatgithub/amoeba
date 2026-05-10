import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { ImageCategory, type CategorizedImage } from "../types/imageTypes";

interface ImageGalleryModalProps {
  isOpen: boolean;
  images: CategorizedImage[];
  onClose: () => void;
  initialCategory?: ImageCategory;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  images,
  onClose,
  initialCategory = ImageCategory.HALL,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>(
    initialCategory
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen) return null;

  // Filter images by selected category
  const filteredImages = images.filter(
    (img) => img.category === selectedCategory
  );

  const currentImage = filteredImages[selectedImageIndex];

  // Get unique categories that have images
  const availableCategories = Object.values(ImageCategory).filter((cat) =>
    images.some((img) => img.category === cat)
  );

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleCategoryChange = (category: ImageCategory) => {
    setSelectedCategory(category);
    setSelectedImageIndex(0);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-semibold">Property Gallery</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <RxCross2 size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Main Image Display */}
            <div className="bg-black min-h-[300px] md:min-h-[400px] flex items-center justify-center relative">
              <img
                src={currentImage?.url}
                alt={`${selectedCategory} image`}
                className="w-full h-full object-contain"
              />

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs md:text-sm px-3 py-1 rounded-lg">
                {selectedImageIndex + 1}/{filteredImages.length}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="border-b border-gray-200 px-4 py-3 md:py-4 sticky top-0 bg-white">
              <div className="flex gap-2 md:gap-3 overflow-x-auto">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 md:px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category} ({images.filter((img) => img.category === category).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="p-4 md:p-6">
              <h3 className="text-sm md:text-base font-semibold mb-3 text-gray-700">
                {selectedCategory} Images
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                {filteredImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                      selectedImageIndex === index
                        ? "border-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${selectedCategory} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-blue-600/20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageGalleryModal;
