import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const HeaderCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const slides = [
    {
      id: 1,
      video: "/images/h3.mp4",
      title: "Seamless Precision, Brought to Life",
      heading: "Crafting Excellence in Real Estate",
      desc: "From facades to interiors, we deliver precision-engineered real estate solutions that redefine modern living.",
    },
    {
      id: 2,
      video: "/images/h2.mp4",
      title: "Innovation in Every Layer",
      heading: "Transforming Spaces with Technology & Design",
      desc: "With innovation and craftsmanship at our core, we create advanced portal that combine beauty, strength, and sustainability.",
    },
    {
      id: 3,
      video: "/images/h1.mp4",
      title: "A Legacy of Trust",
      heading: "Partnering with Architects & Designers Across India",
      desc: "With 2267+ projects, 597+ architects, and presence in 140+ cities across India, we continue to build transparency that inspires.",
    },
  ];

  const goTo = (index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((index + slides.length) % slides.length);
    setTimeout(() => setAnimating(false), 800);
  };

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(current + 1), 9000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "90vh" }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={slide.video} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-lg md:text-xl text-themeyellow uppercase tracking-[3px] font-semibold mb-4">
                {slide.title}
                <span className="block w-20 h-[2px] bg-themeyellow mx-auto mt-2" />
              </h4>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                {slide.heading}
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-8 leading-relaxed">
                {slide.desc}
              </p>
              <div className="flex justify-center gap-4">                
                <NavLink to="/property-search" onClick={()=> scrollTo(0,0)}
                  className="bg-themeyellow hover:bg-themeyellow-dull animate-pulse text-black font-semibold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
                >
                  Explore Properties
                </NavLink>
                <NavLink to="/contact" onClick={()=> scrollTo(0,0)}
                  className="bg-primary hover:bg-primary-dull animate-pulse text-white font-semibold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
                >
                  Contact Us
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows — always on top */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute hidden md:flex items-center justify-center left-6 top-1/2 -translate-y-1/2 z-[999] text-white p-4 rounded-full shadow-lg transition"
      >
        <FaArrowLeft size={20} />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute hidden md:flex items-center justify-center right-6 top-1/2 -translate-y-1/2 z-[999] text-white p-4 rounded-full shadow-lg transition"
      >
        <FaArrowRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[999] flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderCarousel;