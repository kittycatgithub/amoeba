import { useState, memo, useCallback, useMemo } from "react";
import { RxCross2 } from "react-icons/rx";
import { ImageCategory, type CategorizedImage } from "../types/imageTypes";
import ImageZoomViewer from "./ImageZoomViewer";

interface ImageDrawerProps {
  isOpen: boolean;
  images: CategorizedImage[];
  onClose: () => void;
}

const ImageDrawer = memo<ImageDrawerProps>(({ isOpen, images, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>(
    ImageCategory.HALL
  );
  const [zoomedImage, setZoomedImage] = useState<CategorizedImage | null>(null);

  // Get unique categories that have images (memoized)
  const availableCategories = useMemo(
    () =>
      Object.values(ImageCategory).filter((cat) =>
        images.some((img) => img.category === cat)
      ),
    [images]
  );
  console.log(availableCategories, 'availableCategories')

  // Filter images by selected category (memoized)
  const filteredImages = useMemo(
    // () => images.filter((img) => img.category === selectedCategory),
    () => images.filter((img) => img),
    [images, selectedCategory]
  );

  const handleCategoryChange = useCallback(
    (category: ImageCategory) => {
      setSelectedCategory(category);
    },
    []
  );

  const handleImageClickZoom = useCallback((image: CategorizedImage) => {
    setZoomedImage(image);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setZoomedImage(null);
  }, []);

  if (!isOpen) return null;

  if (zoomedImage) {
    return (
      <ImageZoomViewer
        image={zoomedImage}
        onClose={handleCloseZoom}
      />
    );
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* DRAWER CONTAINER - FULL SCREEN */}
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* HEADER WITH TABS */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-4 pt-4 pb-0">
            <h2 className="text-lg font-bold text-gray-900">Gallery</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <RxCross2 size={24} />
            </button>
          </div>

          {/* CATEGORY TABS */}
          {/* <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar border-b border-gray-100">
            {availableCategories.map((category) => {
              const categoryImages = images.filter(
                (img) => img.category === category
              );
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category} ({categoryImages.length})
                </button>
              );
            })}
          </div> */}
        </div>

        {/* IMAGES GRID */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="p-4 h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 h-full">
              {filteredImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleImageClickZoom(image)}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-200 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={image.url}
                    // src={`${import.meta.env.VITE_API_URL}${image.url}`}
                    alt={`${selectedCategory}-image`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
                </button>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">No images found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

ImageDrawer.displayName = "ImageDrawer";

export default ImageDrawer;
