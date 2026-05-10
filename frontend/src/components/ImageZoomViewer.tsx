import React, { useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { type CategorizedImage } from "../types/imageTypes";

interface ImageZoomViewerProps {
  image: CategorizedImage;
  onClose: () => void;
}

const ImageZoomViewer: React.FC<ImageZoomViewerProps> = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartDistance = useRef(0);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 1), 5));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistance.current = distance;
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = distance / touchStartDistance.current;
      setScale((prev) => Math.min(Math.max(prev * scaleFactor, 1), 5));
      touchStartDistance.current = distance;
    } else if (isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleTap = () => {
    setScale((prev) => (prev > 1 ? 1 : 2));
    setPosition({ x: 0, y: 0 });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-black/80 backdrop-blur sticky top-0 z-10">
        <span className="text-white text-sm font-semibold">{image.category}</span>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-2 rounded-full transition"
        >
          <RxCross2 size={24} />
        </button>
      </div>

      {/* IMAGE CONTAINER */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center bg-black relative cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleTap}
      >
        <img
          ref={imgRef}
          src={image.url}
          alt={image.category}
          className="select-none max-w-full max-h-full transition-transform duration-200"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          }}
          data-draggable={false}
        />
      </div>

      {/* ZOOM CONTROLS */}
      <div className="flex justify-center items-center gap-4 p-4 bg-black/80 backdrop-blur sticky bottom-0">
        <button
          onClick={() => setScale((prev) => Math.max(prev - 0.2, 1))}
          className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-semibold"
        >
          −
        </button>
        <span className="text-white text-sm font-semibold min-w-16 text-center">
          {(scale * 100).toFixed(0)}%
        </span>
        <button
          onClick={() => setScale((prev) => Math.min(prev + 0.2, 5))}
          className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-semibold"
        >
          +
        </button>
        {scale > 1 && (
          <button
            onClick={resetZoom}
            className="text-white bg-red-500/30 hover:bg-red-500/50 px-4 py-2 rounded-lg transition font-semibold ml-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* INSTRUCTIONS */}
      <div className="text-white text-xs text-center p-2 bg-black/80">
        {scale === 1 ? "Double tap or use + to zoom" : "Drag to pan, pinch to zoom"}
      </div>
    </div>
  );
};

export default ImageZoomViewer;
