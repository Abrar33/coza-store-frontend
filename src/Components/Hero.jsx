import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const slides = [
  {
    heading: "NEW SEASON",
    subheading: "Women Collection 2018",
    image: "https://preview.colorlib.com/theme/cozastore/images/slide-01.jpg.webp",
  },
  {
    heading: "COATS & JACKETS",
    subheading: "Men New-Season",
    image: "https://preview.colorlib.com/theme/cozastore/images/slide-02.jpg.webp",
  },
  {
    heading: "NEW ARRIVALS",
    subheading: "Men Collection 2018",
    image: "https://preview.colorlib.com/theme/cozastore/images/slide-03.jpg.webp",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  // Refs for animated elements
  const subheadingRef = useRef(null);
  const headingRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const timelineRef = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (timelineRef.current) timelineRef.current.kill();

    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.fromTo(
      subheadingRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    )
      .fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "<+0.3"
      )
      .fromTo(
        buttonRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "<+0.3"
      )
      .fromTo(
        imageRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "<+0.3"
      )
      .to({}, { duration: 2.5 }) // Hold duration before auto-transition
      .add(() => nextSlide());

    return () => tl.kill();
  }, [current]);

  return (
    <section className="-mt-9 relative bg-white h-screen overflow-hidden pt-[112px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.heading}
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-screen-xl mx-auto px-6 py-16 h-full">
        {/* Left Text */}
        <div className="md:w-1/2 space-y-4 text-center md:text-left">
          <p ref={subheadingRef} className="text-lg text-gray-600 font-medium">
            {slide.subheading}
          </p>
          <h1 ref={headingRef} className="text-4xl font-bold text-gray-900">
            {slide.heading}
          </h1>
          <a
            ref={buttonRef}
            href="/shop"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Shop Now
          </a>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img
            ref={imageRef}
            src={slide.image}
            alt={slide.heading}
            className="rounded-lg shadow-xl w-[90%] max-w-md"
          />
        </div>
      </div>

      {/* Manual Arrows */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={prevSlide}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default Hero;